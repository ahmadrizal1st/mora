<?php

namespace App\Jobs;

use App\Enums\DocumentSchema;
use App\Models\Document;
use App\Services\LLMMapper;
use App\Services\PromptBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessOCRResult implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected string $raw_text,
        protected string $doc_type,
        protected int $document_id
    ) {}

    /**
     * Execute the job.
     */
    public function handle(LLMMapper $mapper, PromptBuilder $builder): void
    {
        $document = Document::findOrFail($this->document_id);

        $schema = DocumentSchema::from($this->doc_type);
        
        $prompt = $builder->build(
            $this->raw_text,
            $schema->schema(),
            $schema->value
        );

        $extractedData = $mapper->map($prompt);

        $document->update([
            'extracted_data' => $extractedData,
            'status' => 'completed',
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Document::where('id', $this->document_id)->update([
            'status' => 'failed',
            'error_message' => $exception->getMessage(),
        ]);

        Log::error("ProcessOCRResult failed for Document #{$this->document_id}: " . $exception->getMessage());
    }
}
