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
        protected int $document_id,
        protected ?int $userId = null
    ) {}

    public function getDocumentId(): int
    {
        return $this->document_id;
    }

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

        $structuredData = $mapper->map($prompt, $this->userId);

        $document->update([
            'extracted_data' => $structuredData,
            'status' => 'completed',
        ]);

        $transaction = \App\Models\Transaction::create([
            'user_id' => $this->userId,
            'type' => \App\Models\Transaction::TYPE_EXPENSE,
            'amount_raw' => $structuredData['total_amount'] ?? 0,
            'tx_date' => $structuredData['date'] ?? now()->format('Y-m-d'),
            'merchant' => $structuredData['merchant_name'] ?? 'Unknown',
            'notes' => 'Generated from OCR: ' . ($document->original_filename ?? 'document'),
            'currency_id' => 1,
            'account_id' => 4,
            'status_id' => 1,
            'dynamic_fields' => [
                'document_id' => $this->document_id,
                'items' => $structuredData['items'] ?? [],
            ]
        ]);

        $document->update(['transaction_id' => $transaction->id]);
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
