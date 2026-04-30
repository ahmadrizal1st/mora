<?php

namespace App\Jobs;

use App\Models\Document;
use App\Models\User;
use App\Notifications\TrackerProcessedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;
use Throwable;

class ProcessDocumentJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 1; // Jangan terlalu banyak retry untuk OCR jika timeout
    public int $timeout = 60; // Timeout job keseluruhan

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected int $documentId,
        protected string $language = 'en'
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $document = Document::findOrFail($this->documentId);
        $user = User::findOrFail($document->user_id);
        
        $aiUrl = config('services.ai.url', 'http://localhost:8000/api/extract');

        try {
            // Jika dokumen adalah text/plain, kita tidak perlu ke FastAPI (langsung ke LLM)
            if ($document->mime_type === 'text/plain') {
                ProcessAIResult::dispatch(
                    $document->raw_text,
                    $document->doc_type,
                    $document->id,
                    $user->id
                );
                return;
            }

            // Kirim ke FastAPI dengan timeout 20 detik sesuai permintaan user
            $response = Http::withHeaders([
                'X-API-KEY' => config('services.ai.key')
            ])->timeout(20)->attach(
                'file',
                Storage::get($document->file_path),
                $document->original_filename
            )->post($aiUrl, [
                'language' => $this->language,
            ]);

            if ($response->failed()) {
                $errorMsg = $response->json('message') ?? 'AI Service returned an error.';
                $this->handleFailure($document, $user, "Gagal memproses file: {$errorMsg}");
                return;
            }

            $rawText = $response->json('text');
            
            $document->update([
                'raw_text' => $rawText,
            ]);

            // Lanjut ke tahap mapping LLM
            ProcessAIResult::dispatch(
                $rawText,
                $document->doc_type,
                $document->id,
                $user->id
            );

        } catch (Exception $e) {
            $message = "Proses gagal: " . $e->getMessage();
            if (str_contains(strtolower($e->getMessage()), 'timeout') || str_contains(strtolower($e->getMessage()), 'timed out')) {
                $message = "Proses gagal karena server AI memakan waktu lebih dari 20 detik.";
            }
            $this->handleFailure($document, $user, $message);
        }
    }

    protected function handleFailure(Document $document, User $user, string $message): void
    {
        $document->update([
            'status' => 'failed',
            'error_message' => $message
        ]);

        $user->notify(new TrackerProcessedNotification(
            'error',
            'Gagal Memproses Tracker',
            $message,
            ['document_id' => $document->id, 'filename' => $document->original_filename]
        ));

        Log::error("ProcessDocumentJob Error for Doc #{$document->id}: {$message}");
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        // Jika job benar-benar gagal (bukan karena logic internal yang di-catch)
        $document = Document::find($this->documentId);
        if ($document) {
            $user = User::find($document->user_id);
            if ($user) {
                $this->handleFailure($document, $user, "Fatal error: " . $exception->getMessage());
            }
        }
    }
}
