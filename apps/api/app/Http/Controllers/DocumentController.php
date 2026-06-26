<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\LLMMapper;
use App\Services\PromptBuilder;
use App\Services\TransactionService;
use Exception;
use Carbon\Carbon;

class DocumentController extends Controller
{
    /**
     * Handle file upload (image/audio) to extract text via AI Service
     * and automatically create a transaction.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'doc_type' => 'nullable|string'
        ]);

        $file = $request->file('file');
        $docType = $request->input('doc_type', 'expense');
        $user = $request->user();

        try {
            // 1. Send file to Python AI Service
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
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memproses file di AI Service.'
                ], 500);
            }

            $aiData = $response->json();
            $extractedText = $aiData['text'] ?? '';

            if (empty(trim($extractedText))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teks tidak ditemukan dalam dokumen/audio ini.'
                ], 422);
            }

            // 2. Process the extracted text using LLMMapper
            return $this->processExtractedText($user, $extractedText, $docType);

        } catch (Exception $e) {
            Log::error('Document Upload Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle raw text input (from TrackerTextPage) to create a transaction.
     */
    public function processText(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'doc_type' => 'nullable|string'
        ]);

        $user = $request->user();
        $text = $request->input('text');
        $docType = $request->input('doc_type', 'expense');

        return $this->processExtractedText($user, $text, $docType);
    }

    /**
     * Reusable logic to map text to transaction and save it.
     */
    private function processExtractedText($user, string $text, string $docType)
    {
        try {
            $schemaJson = json_encode([
                'tx' => [
                    [
                        'type' => 'expense', // expense or income
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
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengekstrak data transaksi dari teks.'
                ], 422);
            }

            // Get default account
            $account = $user->accounts()->first();
            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda belum memiliki akun (dompet/bank).'
                ], 422);
            }

            $createdTransactions = [];

            foreach ($transactions as $tx) {
                // Ensure defaults
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

            return response()->json([
                'success' => true,
                'message' => count($createdTransactions) . ' transaksi berhasil diproses.',
                'data' => $createdTransactions,
                'raw_text' => $text
            ]);

        } catch (Exception $e) {
            Log::error('Text Processing Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses teks: ' . $e->getMessage(),
                'raw_text' => $text
            ], 500);
        }
    }
}
