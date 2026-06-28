<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file',
            'doc_type' => 'nullable|string'
        ]);

        try {
            $result = DocumentService::upload(
                $request->user(),
                $request->file('file'),
                $request->input('doc_type', 'expense')
            );

            return response()->json([
                'success' => true,
                'message' => count($result['transactions']) . ' transaksi berhasil diproses.',
                'data' => $result['transactions'],
                'raw_text' => $result['raw_text']
            ]);

        } catch (\Exception $e) {
            $statusCode = $e->getMessage() === 'Teks tidak ditemukan dalam dokumen/audio ini.' || $e->getMessage() === 'Gagal mengekstrak data transaksi dari teks.' || $e->getMessage() === 'Anda belum memiliki akun (dompet/bank).' ? 422 : 500;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    public function processText(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
            'doc_type' => 'nullable|string'
        ]);

        try {
            $result = DocumentService::processText(
                $request->user(),
                $request->input('text'),
                $request->input('doc_type', 'expense')
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
