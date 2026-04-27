<?php

namespace App\Http\Controllers;

use App\Enums\DocumentSchema;
use App\Jobs\ProcessOCRResult;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Enum;
use Exception;

class DocumentController extends Controller
{
    /**
     * Handle document upload, OCR processing, and dispatch LLM mapping job.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
            'doc_type' => ['required', new Enum(DocumentSchema::class)],
        ]);

        $ocrUrl = config('services.ocr.url', 'http://localhost:8000/api/extract');

        try {
            $file = $request->file('file');

            // Kirim file ke service FastAPI OCR
            $response = Http::attach(
                'file',
                fopen($file->getPathname(), 'r'),
                $file->getClientOriginalName()
            )->post($ocrUrl);

            if ($response->failed()) {
                return response()->json([
                    'message' => 'OCR Service returned an error.',
                    'details' => $response->json('message') ?? 'Unknown error'
                ], 502);
            }

            $rawText = $response->json('text');

            // Simpan ke database dengan status pending
            $document = Document::create([
                'doc_type' => $request->doc_type,
                'raw_text' => $rawText,
                'status' => 'pending',
            ]);

            // Jalankan mapping LLM secara async
            ProcessOCRResult::dispatch(
                $rawText,
                $request->doc_type,
                $document->id,
                auth()->id()
            );

            return response()->json([
                'message' => 'Document uploaded and processing started.',
                'document_id' => $document->id,
            ], 202);

        } catch (Exception $e) {
            Log::error("OCR Service Error: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to reach OCR service. Please try again later.',
            ], 503);
        }
    }
}
