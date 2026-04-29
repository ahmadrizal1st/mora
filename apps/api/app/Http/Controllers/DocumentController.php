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
        set_time_limit(0);
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
            'doc_type' => ['required', new Enum(DocumentSchema::class)],
        ]);

        $ocrUrl = config('services.ocr.url', 'http://localhost:8000/api/extract');

        try {
            $file = $request->file('file');
            $mime = $file->getMimeType() ?? '';

            // Tentukan bahasa untuk Whisper:
            // - Gunakan field 'language' dari request jika ada
            // - Default 'id' untuk audio agar Whisper tidak salah deteksi ke English
            // - Default 'en' untuk file dokumen
            $isAudio = str_starts_with($mime, 'audio/')
                || in_array($mime, ['video/webm', 'video/mp4'], true);
            $language = $request->input('language', $isAudio ? 'id' : 'en');

            // Kirim file ke service FastAPI OCR
            $response = Http::withHeaders([
                'X-API-KEY' => config('services.ocr.key')
            ])->timeout(300)->attach(
                'file',
                fopen($file->getPathname(), 'r'),
                $file->getClientOriginalName()
            )->post($ocrUrl, [
                'language' => $language,
            ]);

            if ($response->failed()) {
                return response()->json([
                    'message' => 'OCR Service returned an error.',
                    'details' => $response->json('message') ?? 'Unknown error'
                ], 502);
            }

            $rawText = $response->json('text');

            // Simpan file secara lokal untuk audit trail
            $storedPath = $file->store('documents');

            // Simpan ke database dengan detail lengkap
            $document = Document::create([
                'user_id' => auth()->id(),
                'doc_type' => $request->doc_type,
                'file_path' => $storedPath,
                'mime_type' => $file->getMimeType(),
                'original_filename' => $file->getClientOriginalName(),
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

    /**
     * Handle direct text processing and dispatch LLM mapping job.
     */
    public function processText(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'doc_type' => ['required', new Enum(DocumentSchema::class)],
        ]);

        try {
            $rawText = $request->input('text');

            // Simpan ke database dengan detail text
            $document = Document::create([
                'user_id' => auth()->id(),
                'doc_type' => $request->doc_type,
                'raw_text' => $rawText,
                'mime_type' => 'text/plain',
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
                'message' => 'Text received and processing started.',
                'document_id' => $document->id,
            ], 202);

        } catch (Exception $e) {
            Log::error("Text Processing Error: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to process text. Please try again later.',
            ], 500);
        }
    }
}
