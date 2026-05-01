<?php

namespace App\Http\Controllers;

use App\Enums\DocumentSchema;
use App\Enums\DocumentStatus;
use App\Jobs\ProcessAIResult;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Enum;
use Exception;

class DocumentController extends Controller
{
    /**
     * Handle document upload and dispatch processing job.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
            'doc_type' => ['required', new Enum(DocumentSchema::class)],
        ]);

        try {
            $file = $request->file('file');
            $mime = $file->getMimeType() ?? '';

            // Tentukan bahasa untuk Whisper:
            $isAudio = str_starts_with($mime, 'audio/')
                || in_array($mime, ['video/webm', 'video/mp4'], true);
            $language = $request->input('language', $isAudio ? 'id' : 'en');

            // Simpan file secara lokal
            $storedPath = $file->store('documents');

            // Simpan ke database dengan status pending
            $document = Document::create([
                'user_id' => $request->user()->id,
                'doc_type' => $request->doc_type,
                'file_path' => $storedPath,
                'mime_type' => $mime,
                'original_filename' => $file->getClientOriginalName(),
                'status' => DocumentStatus::PENDING->value,
            ]);

            // Jalankan seluruh pemrosesan (FastAPI + LLM) secara async
            \App\Jobs\ProcessDocumentJob::dispatch(
                $document->id,
                $language
            );

            return response()->json([
                'message' => 'Document uploaded and processing started in background.',
                'document_id' => $document->id,
            ], 202);

        } catch (Exception $e) {
            Log::error("Document Upload Error: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to start document processing.',
            ], 500);
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
                'status' => DocumentStatus::PENDING->value,
            ]);

            // Jalankan pemrosesan via Job agar konsisten dengan notifikasi
            \App\Jobs\ProcessDocumentJob::dispatch($document->id);

            return response()->json([
                'message' => 'Text received and processing started.',
                'document_id' => $document->id,
            ], 202);

        } catch (Exception $e) {
            Log::error("Text Processing Error: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to process text.',
            ], 500);
        }
    }
}
