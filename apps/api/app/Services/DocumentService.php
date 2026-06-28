<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\LLMMapper;
use App\Services\PromptBuilder;
use App\Services\TransactionService;
use Exception;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;

class DocumentService
{
    public static function upload(User $user, UploadedFile $file, string $docType = 'expense'): array
    {
        try {
            $aiUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8000/api/extract');
            $aiKey = env('AI_SERVICE_KEY');

            $response = Http::withHeaders([
                'X-API-Key' => $aiKey
            ])
            ->timeout(60)
            ->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
            ->post($aiUrl, [
                'language' => 'id'
            ]);

            if (!$response->successful()) {
                Log::error('AI Service Error: ' . $response->body());
                throw new Exception('Gagal memproses file di AI Service.');
            }

            $aiData = $response->json();
            $extractedText = $aiData['text'] ?? '';

            if (empty(trim($extractedText))) {
                throw new Exception('Teks tidak ditemukan dalam dokumen/audio ini.');
            }

            return self::processExtractedText($user, $extractedText, $docType);

        } catch (Exception $e) {
            Log::error('Document Upload Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    public static function processText(User $user, string $text, string $docType = 'expense'): array
    {
        return self::processExtractedText($user, $text, $docType);
    }

    private static function processExtractedText(User $user, string $text, string $docType): array
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
            $prompt = $promptBuilder->build($text, $schemaJson, $docType);

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

                $created = TransactionService::store($user, $data);
                $createdTransactions[] = $created;
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
}
