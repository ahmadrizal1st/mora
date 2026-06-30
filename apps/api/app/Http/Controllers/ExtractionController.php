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
            'extraction_type' => 'nullable|string'
        ]);

        try {
            $result = ExtractionService::processExtractedText(
                $request->user(),
                $request->input('text'),
                $request->input('extraction_type', 'expense')
            );

            return response()->json([
                'success' => true,
                'message' => count($result['transactions']) . ' transaksi berhasil diproses.',
                'data' => $result['transactions'],
                'raw_text' => $result['raw_text']
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
