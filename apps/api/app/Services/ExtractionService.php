<?php

namespace App\Services;

use App\Models\User;
use App\Models\Extraction;
use App\Jobs\ProcessExtraction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;

class ExtractionService
{
    public static function uploadAndDispatch(User $user, UploadedFile $file, string $extractionType = 'expense'): Extraction
    {
        $filePath = $file->store('extractions');

        $extraction = $user->extractions()->create([
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_mime_type' => $file->getMimeType(),
            'extraction_type' => $extractionType,
            'status' => 'pending',
        ]);

        ProcessExtraction::dispatch($extraction);

        return $extraction;
    }

    public static function extractText(UploadedFile $file, ?User $user = null): string
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'audio/') || str_starts_with($mimeType, 'video/')) {
            $extractedText = self::extractAudioWithGroq($file, $user);
        } else {
            throw new Exception('Image processing should use processImageDirectly instead of extractText.');
        }

        if (empty(trim($extractedText))) {
            throw new Exception('Teks tidak ditemukan dalam dokumen/audio ini.');
        }

        return $extractedText;
    }

    public static function processExtractedText(User $user, string $text, string $extractionType, bool $reviewOnly = false): array
    {
        try {
            $schemaJson = json_encode([
                'tx' => [
                    [
                        'type' => 'expense',
                        'amount' => 50000,
                        'tx_date' => '2026-06-25',
                        'merchant' => 'Toko Buku',
                        'notes' => 'Catatan tambahan jika ada'
                    ]
                ],
                'reply' => 'Sapaan ramah atau konfirmasi terkait transaksi.'
            ]);

            $promptBuilder = app(PromptBuilder::class);
            $prompt = $promptBuilder->build($text, $schemaJson, $extractionType);

            $llmMapper = app(LLMMapper::class);
            $mappedData = $llmMapper->map($prompt, $user->id);

            $transactions = $mappedData['tx'] ?? [];
            $reply = $mappedData['reply'] ?? null;
            
            if (empty($transactions) && empty($reply)) {
                throw new Exception('Gagal mengekstrak data transaksi atau balasan dari teks.');
            }

            $account = $user->accounts()->first();
            if (!$account) {
                throw new Exception('Anda belum memiliki akun (dompet/bank).');
            }

            if ($reviewOnly) {
                $previewTransactions = [];
                foreach ($transactions as $tx) {
                    $amount = (float) preg_replace('/[^0-9.]/', '', (string)($tx['amount'] ?? 0));
                    $previewTransactions[] = [
                        'account_id' => $account->id,
                        'type' => $tx['type'] ?? 'expense',
                        'amount' => $amount,
                        'tx_date' => $tx['tx_date'] ?? \Carbon\Carbon::now()->toDateString(),
                        'merchant' => $tx['merchant'] ?? null,
                        'notes' => $tx['notes'] ?? $text,
                        'input_method' => 'auto',
                        'is_preview' => true,
                    ];
                }
                return [
                    'transactions' => $previewTransactions,
                    'raw_text' => $text,
                    'reply' => $reply
                ];
            }

            $createdTransactions = [];
            foreach ($transactions as $tx) {
                $amount = (float) preg_replace('/[^0-9.]/', '', (string)($tx['amount'] ?? 0));
                $data = [
                    'account_id' => $account->id,
                    'type' => $tx['type'] ?? 'expense',
                    'amount' => $amount,
                    'tx_date' => $tx['tx_date'] ?? \Carbon\Carbon::now()->toDateString(),
                    'merchant' => $tx['merchant'] ?? null,
                    'notes' => $tx['notes'] ?? $text,
                    'input_method' => 'auto',
                ];
                $createdTransactions[] = TransactionService::store($user, $data);
            }

            return [
                'transactions' => $createdTransactions,
                'raw_text' => $text,
                'reply' => $reply
            ];


        } catch (Exception $e) {
            Log::error('Text Processing Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    public static function processMediaDirectly(array $files, string $text, User $user, string $extractionType, bool $reviewOnly = false): array
    {
        try {
            $apiKey = env('GEMINI_API_KEY');

            $aiConfig = \Illuminate\Support\Facades\DB::table('llm_providers')
                ->where('user_id', $user->id)
                ->where('name', 'gemini')
                ->where('is_active', true)
                ->first();
            
            if ($aiConfig && !empty($aiConfig->api_key)) {
                $apiKey = $aiConfig->api_key;
            }
            
            if (!$apiKey) {
                 $defaultConfig = \Illuminate\Support\Facades\DB::table('llm_providers')
                    ->whereNull('user_id')
                    ->where('name', 'gemini')
                    ->where('is_active', true)
                    ->first();
                if ($defaultConfig && !empty($defaultConfig->api_key)) {
                    $apiKey = $defaultConfig->api_key;
                }
            }

            if (!$apiKey) {
                throw new Exception('Gemini API Key tidak ditemukan. Harap tambahkan di pengaturan AI Provider Anda.');
            }

            $schemaJson = json_encode([
                'tx' => [
                    [
                        'type' => 'expense',
                        'amount' => 50000,
                        'tx_date' => '2026-06-25',
                        'merchant' => 'Toko Buku',
                        'notes' => 'Catatan tambahan jika ada'
                    ]
                ],
                'reply' => 'Sapaan ramah atau konfirmasi terkait transaksi.'
            ]);

            $prompt = <<<PROMPT
Role: Financial Extraction Expert. Output: RAW JSON ONLY.
Schema: {$schemaJson}

## STRICT RULES:
- Extract all transactions visible in the image or mentioned in the audio.
- DATE: Always YYYY-MM-DD. Use today if unknown: 2026-05-02.
- NO COMMENTS: Do not include "//" or explanations.
- AMOUNT: Clean integer (no dots/commas). Example: 334000.
- JSON: Ensure valid syntax, no trailing commas.
PROMPT;

            $parts = [];
            
            $finalPrompt = $prompt;
            if (!empty($text)) {
                $finalPrompt .= "\n\nPesan Pengguna Tambahan: " . $text;
            }
            $parts[] = ['text' => $finalPrompt];

            foreach ($files as $file) {
                $mimeType = $file->getMimeType() ?: 'application/octet-stream';
                if (str_contains($file->getClientOriginalName(), 'voice-record') || str_ends_with($file->getClientOriginalName(), '.webm')) {
                    $mimeType = 'audio/webm';
                }
                
                $parts[] = [
                    'inline_data' => [
                        'mime_type' => $mimeType,
                        'data' => base64_encode(file_get_contents($file->getRealPath()))
                    ]
                ];
            }

            $payload = [
                'contents' => [
                    [
                        'parts' => $parts
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json'
                ]
            ];

            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(60)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", $payload);

            if (!$response->successful()) {
                Log::error('Gemini Vision Error: ' . $response->body());
                throw new Exception('Gagal memproses gambar dengan Gemini: ' . $response->body());
            }

            $resultData = $response->json();
            $extractedText = $resultData['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            $data = json_decode($extractedText, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Try to clean it using basic regex if markdown
                if (preg_match('/```(?:json)?\s*(.*?)\s*```/is', $extractedText, $matches)) {
                    $data = json_decode(trim($matches[1]), true);
                }
            }

            $transactions = $data['tx'] ?? [];
            $reply = $data['reply'] ?? null;

            if (empty($transactions) && empty($reply)) {
                throw new Exception('Data transaksi atau balasan tidak ditemukan dalam response.');
            }

            $account = $user->accounts()->first();
            if (!$account) {
                throw new Exception('Anda belum memiliki akun (dompet/bank).');
            }

            if ($reviewOnly) {
                $previewTransactions = [];
                foreach ($transactions as $tx) {
                    $amount = (float) preg_replace('/[^0-9.]/', '', (string)($tx['amount'] ?? 0));
                    $previewTransactions[] = [
                        'account_id' => $account->id,
                        'type' => $tx['type'] ?? 'expense',
                        'amount' => $amount,
                        'tx_date' => $tx['tx_date'] ?? Carbon::now()->toDateString(),
                        'merchant' => $tx['merchant'] ?? null,
                        'notes' => $tx['notes'] ?? 'Extracted from media',
                        'input_method' => 'auto',
                        'is_preview' => true,
                    ];
                }
                return [
                    'transactions' => $previewTransactions,
                    'raw_text' => json_encode($transactions, JSON_PRETTY_PRINT)
                ];
            }

            $createdTransactions = [];
            foreach ($transactions as $tx) {
                $amount = (float) preg_replace('/[^0-9.]/', '', (string)($tx['amount'] ?? 0));
                $dataToSave = [
                    'account_id' => $account->id,
                    'type' => $tx['type'] ?? 'expense',
                    'amount' => $amount,
                    'tx_date' => $tx['tx_date'] ?? Carbon::now()->toDateString(),
                    'merchant' => $tx['merchant'] ?? null,
                    'notes' => $tx['notes'] ?? 'Extracted from media',
                    'input_method' => 'auto',
                ];
                $createdTransactions[] = TransactionService::store($user, $dataToSave);
            }

            return [
                'transactions' => $createdTransactions,
                'raw_text' => json_encode($transactions, JSON_PRETTY_PRINT)
            ];

        } catch (Exception $e) {
            Log::error('Image Processing Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    private static function extractAudioWithGroq(UploadedFile $file, ?User $user = null): string
    {
        $apiKey = env('GROQ_API_KEY');

        if ($user) {
            $aiConfig = \Illuminate\Support\Facades\DB::table('llm_providers')
                ->where('user_id', $user->id)
                ->where('name', 'groq')
                ->where('is_active', true)
                ->first();
            
            if ($aiConfig && !empty($aiConfig->api_key)) {
                $apiKey = $aiConfig->api_key;
            }
        }
        
        if (!$apiKey) {
             $defaultConfig = \Illuminate\Support\Facades\DB::table('llm_providers')
                ->whereNull('user_id')
                ->where('name', 'groq')
                ->where('is_active', true)
                ->first();
            if ($defaultConfig && !empty($defaultConfig->api_key)) {
                $apiKey = $defaultConfig->api_key;
            }
        }

        if (!$apiKey) {
            throw new Exception('Groq API Key tidak ditemukan. Harap tambahkan di pengaturan AI Provider Anda.');
        }

        $fileResource = fopen($file->getRealPath(), 'r');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
        ])
        ->timeout(60)
        ->attach('file', $fileResource, $file->getClientOriginalName())
        ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
            'model' => 'whisper-large-v3',
            'response_format' => 'json',
            'language' => 'id'
        ]);

        if (is_resource($fileResource)) {
            fclose($fileResource);
        }

        if (!$response->successful()) {
            Log::error('Groq Whisper Error: ' . $response->body());
            throw new Exception('Gagal mentranskripsi audio dengan Groq: ' . $response->body());
        }

        return $response->json('text') ?? '';
    }
}
