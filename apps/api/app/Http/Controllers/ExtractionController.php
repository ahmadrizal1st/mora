<?php

namespace App\Http\Controllers;

use App\Models\Extraction;
use App\Services\ExtractionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExtractionController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'extraction_type' => 'nullable|string'
        ]);

        try {
            $extraction = ExtractionService::uploadAndDispatch(
                $request->user(),
                $request->file('file'),
                $request->input('extraction_type', 'expense')
            );

            return response()->json([
                'success' => true,
                'message' => 'File sedang diproses. Anda akan menerima notifikasi ketika selesai.',
                'extraction_id' => $extraction->id,
            ], 202);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadDirect(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'files' => 'nullable|array|max:5',
                'files.*' => 'file|max:15360|mimes:jpg,jpeg,png,webp,pdf,csv,webm,mp3,wav,m4a',
                'text' => 'nullable|string',
                'extraction_type' => 'nullable|string',
                'review_only' => 'nullable|boolean'
            ]);

            $files = $request->file('files') ?? [];
            if (empty($files) && empty($request->input('text'))) {
                throw new \Exception('Minimal harus melampirkan file atau pesan teks.');
            }

            $result = ExtractionService::processMediaDirectly(
                $files,
                $request->input('text', ''),
                $request->user(),
                $request->input('extraction_type', 'expense'),
                filter_var($request->input('review_only', false), FILTER_VALIDATE_BOOLEAN)
            );

            return response()->json([
                'success' => true,
                'transactions' => $result['transactions'] ?? [],
                'reply' => $result['reply'] ?? null
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, Extraction $extraction): JsonResponse
    {
        if ($extraction->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'success' => true,
            'data' => $extraction,
        ]);
    }

    public function processText(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
            'extraction_type' => 'nullable|string',
            'review_only' => 'nullable|boolean'
        ]);

        try {
            $result = ExtractionService::processExtractedText(
                $request->user(),
                $request->input('text'),
                $request->input('extraction_type', 'expense'),
                $request->boolean('review_only', false)
            );

            return response()->json([
                'success' => true,
                'message' => count($result['transactions']) . ' transaksi berhasil diproses.',
                'data' => $result['transactions'],
                'raw_text' => $result['raw_text'],
                'reply' => $result['reply'] ?? null,
            ]);

        } catch (\Exception $e) {
            $statusCode = $e->getMessage() === 'Gagal mengekstrak data transaksi dari teks.' || $e->getMessage() === 'Anda belum memiliki akun (dompet/bank).' ? 422 : 500;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'raw_text' => $request->input('text')
            ], $statusCode);
        }
    }
}
