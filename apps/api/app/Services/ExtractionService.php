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

    public static function extractText(UploadedFile $file): string
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'audio/') || str_starts_with($mimeType, 'video/')) {
            $extractedText = self::extractAudioWithAssemblyAI($file);
        } else {
            $extractedText = self::extractImageWithOCRSpace($file);
        }

        if (empty(trim($extractedText))) {
            throw new Exception('Teks tidak ditemukan dalam dokumen/audio ini.');
        }

        return $extractedText;
    }

    public static function processExtractedText(User $user, string $text, string $extractionType): array
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
                ]
            ]);

            $promptBuilder = app(PromptBuilder::class);
            $prompt = $promptBuilder->build($text, $schemaJson, $extractionType);

            $llmMapper = app(LLMMapper::class);
            $mappedData = $llmMapper->map($prompt, $user->id);

            $transactions = $mappedData['tx'] ?? [];
            if (empty($transactions)) {
                throw new Exception('Gagal mengekstrak data transaksi dari teks.');
            }

            $account = $user->accounts()->first();
            if (!$account) {
                throw new Exception('Anda belum memiliki akun (dompet/bank).');
            }

            $createdTransactions = [];
            foreach ($transactions as $tx) {
                $amount = (float) preg_replace('/[^0-9.]/', '', (string)($tx['amount'] ?? 0));
                $data = [
                    'account_id' => $account->id,
                    'type' => $tx['type'] ?? 'expense',
                    'amount' => $amount,
                    'tx_date' => $tx['tx_date'] ?? Carbon::now()->toDateString(),
                    'merchant' => $tx['merchant'] ?? null,
                    'notes' => $tx['notes'] ?? $text,
                    'input_method' => 'auto',
                ];
                $createdTransactions[] = TransactionService::store($user, $data);
            }

            return [
                'transactions' => $createdTransactions,
                'raw_text' => $text
            ];

        } catch (Exception $e) {
            Log::error('Text Processing Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    private static function extractImageWithOCRSpace(UploadedFile $file): string
    {
        $apiKey = env('OCR_SPACE_API_KEY');
        if (!$apiKey) {
            Log::error('OCR_SPACE_API_KEY is not set in .env');
            throw new Exception('OCR Space API Key tidak ditemukan.');
        }

        // Tentukan ekstensi file untuk dikirim ke OCR Space
        $extension = strtolower($file->getClientOriginalExtension()) ?: 'png';
        $mimeType  = $file->getMimeType() ?: 'image/png';

        $client = new \GuzzleHttp\Client();

        $response = $client->post('https://api.ocr.space/parse/image', [
            'multipart' => [
                [
                    'name'     => 'apikey',
                    'contents' => $apiKey,
                ],
                [
                    'name'     => 'file',
                    'contents' => fopen($file->getRealPath(), 'r'),
                    'filename' => $file->getClientOriginalName(),
                    'headers'  => ['Content-Type' => $mimeType],
                ],
                [
                    'name'     => 'filetype',
                    'contents' => strtoupper($extension),
                ],
                [
                    'name'     => 'OCREngine',
                    'contents' => '1',
                ],
            ],
            'timeout' => 120,
        ]);

        $responseBody = $response->getBody()->getContents();
        
        Log::info('OCR Space Raw Response:', ['response' => $responseBody]);

        if ($response->getStatusCode() !== 200) {
            Log::error('OCR Space HTTP Error', [
                'status' => $response->getStatusCode(),
                'body' => $responseBody
            ]);
            throw new Exception('OCR Space Error (HTTP ' . $response->getStatusCode() . '): ' . $responseBody);
        }

        $result = json_decode($responseBody, true);
        
        // Cek apakah OCR Space mengalami error
        if (isset($result['IsErroredOnProcessing']) && $result['IsErroredOnProcessing'] === true) {
            $errorMessages = is_array($result['ErrorMessage']) ? implode(', ', $result['ErrorMessage']) : ($result['ErrorMessage'] ?? 'Unknown error');
            Log::error('OCR Space Processing Error', [
                'error' => $result['ErrorMessage'],
                'details' => $result
            ]);
            throw new Exception("OCR Space Error: {$errorMessages}");
        }

        // Cek apakah ada parsed results
        if (!isset($result['ParsedResults']) || empty($result['ParsedResults'])) {
            Log::error('OCR Space No Parsed Results', ['result' => $result]);
            throw new Exception('OCR Space Error: No Parsed Results. Full response: ' . $responseBody);
        }

        $parsedText = $result['ParsedResults'][0]['ParsedText'] ?? '';
        
        if (empty(trim($parsedText))) {
            Log::warning('OCR Space returned empty text', ['result' => $result]);
            throw new Exception('OCR Space Error: Tidak ada teks yang dapat diekstrak dari gambar. Coba gambar yang lebih jelas.');
        }

        Log::info('OCR Space Extracted Text:', ['text' => $parsedText]);

        return $parsedText;
    }

    private static function extractAudioWithAssemblyAI(UploadedFile $file): string
    {
        $apiKey = env('ASSEMBLYAI_API_KEY');
        if (!$apiKey) {
            throw new Exception('AssemblyAI API Key tidak ditemukan.');
        }

        // AssemblyAI upload endpoint butuh raw bytes langsung di body (bukan multipart)
        $mimeType    = $file->getMimeType() ?: 'audio/webm';
        $fileContent = file_get_contents($file->getRealPath());

        $uploadResponse = Http::withHeaders([
            'authorization' => $apiKey,
            'Content-Type'  => $mimeType,
        ])
            ->timeout(60)
            ->withBody($fileContent, $mimeType)
            ->post('https://api.assemblyai.com/v2/upload');

        if (!$uploadResponse->successful()) {
            Log::error('AssemblyAI Upload Error: ' . $uploadResponse->body());
            throw new Exception('Gagal mengunggah audio ke AssemblyAI: ' . $uploadResponse->body());
        }

        $audioUrl = $uploadResponse->json('upload_url');

        $transcriptResponse = Http::withHeaders([
            'authorization' => $apiKey,
            'content-type'  => 'application/json',
        ])->timeout(30)->post('https://api.assemblyai.com/v2/transcript', [
            'audio_url'     => $audioUrl,
            'language_code' => 'id',
        ]);

        if (!$transcriptResponse->successful()) {
            Log::error('AssemblyAI Transcript Request Error: ' . $transcriptResponse->body());
            throw new Exception('Gagal meminta transkripsi ke AssemblyAI: ' . $transcriptResponse->body());
        }

        $transcriptId = $transcriptResponse->json('id');

        $maxAttempts = 120; // Poll for up to 4 minutes (120 * 2 seconds)
        $attempt     = 0;
        while ($attempt < $maxAttempts) {
            sleep(2); // Check every 2 seconds (faster!)
            $statusResponse = Http::withHeaders(['authorization' => $apiKey])
                ->get("https://api.assemblyai.com/v2/transcript/{$transcriptId}");

            if (!$statusResponse->successful()) {
                $attempt++;
                continue;
            }

            $status = $statusResponse->json('status');
            if ($status === 'completed') {
                return $statusResponse->json('text');
            } elseif ($status === 'error') {
                $errorDetail = $statusResponse->json('error') ?? 'Unknown error';
                Log::error('AssemblyAI Transcript Error: ' . $statusResponse->body());
                throw new Exception('Gagal mentranskripsi audio: ' . $errorDetail);
            }

            $attempt++;
        }

        throw new Exception('Transkripsi audio memakan waktu terlalu lama.');
    }
}
