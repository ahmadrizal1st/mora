<?php

namespace App\Jobs;

use App\Models\Extraction;
use App\Services\ExtractionService;
use App\Notifications\ExtractionProcessedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class ProcessExtraction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300;

    public function __construct(
        protected Extraction $extraction
    ) {}

    public function handle(ExtractionService $extractionService): void
    {
        try {
            $this->extraction->update(['status' => 'processing']);

            $filePath = $this->extraction->file_path;
            $fileContent = Storage::get($filePath);
            
            $tempFile = tempnam(sys_get_temp_dir(), 'extract_');
            file_put_contents($tempFile, $fileContent);
            $uploadedFile = new \Illuminate\Http\UploadedFile(
                $tempFile,
                $this->extraction->file_name,
                $this->extraction->file_mime_type,
                null,
                true
            );

            $extractedText = $extractionService->extractText($uploadedFile);
            $this->extraction->update(['raw_text' => $extractedText]);

            $result = $extractionService->processExtractedText(
                $this->extraction->user,
                $extractedText,
                $this->extraction->extraction_type
            );

            $this->extraction->update([
                'status' => 'completed',
                'transactions' => $result['transactions'],
            ]);

            $this->extraction->user->notify(
                new ExtractionProcessedNotification(
                    $this->extraction,
                    'completed',
                    count($result['transactions']) . ' transaksi berhasil dibuat dari file ' . $this->extraction->file_name
                )
            );

        } catch (Exception $e) {
            Log::error('ProcessExtraction Job Failed: ' . $e->getMessage(), [
                'extraction_id' => $this->extraction->id,
                'exception' => $e
            ]);

            $this->extraction->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            $this->extraction->user->notify(
                new ExtractionProcessedNotification(
                    $this->extraction,
                    'failed',
                    'Gagal memproses file ' . $this->extraction->file_name . ': ' . $e->getMessage()
                )
            );
        } finally {
            if (isset($tempFile) && file_exists($tempFile)) {
                @unlink($tempFile);
            }
        }
    }
}
