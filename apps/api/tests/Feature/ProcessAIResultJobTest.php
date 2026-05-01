<?php

namespace Tests\Feature;

use App\Jobs\ProcessAIResult;
use App\Models\Document;
use App\Models\User;
use App\Services\LLMMapper;
use App\Services\PromptBuilder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class ProcessAIResultJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_successfully_updates_document(): void
    {
        $user = User::factory()->create();
        $document = Document::create([
            'doc_type' => 'invoice',
            'status' => 'pending',
            'raw_text' => 'Sample OCR Text',
        ]);

        $mockMapper = $this->mock(LLMMapper::class, function (MockInterface $mock) {
            $mock->shouldReceive('map')
                ->once()
                ->andReturn(['total' => 1000]);
        });

        $job = new ProcessAIResult('Sample OCR Text', 'invoice', $document->id, $user->id);
        $job->handle($mockMapper, app(PromptBuilder::class));

        $document->refresh();
        $this->assertEquals('completed', $document->status);
        $this->assertEquals(['total' => 1000], $document->extracted_data);
    }

    public function test_job_fails_updates_document_status(): void
    {
        $document = Document::create([
            'doc_type' => 'invoice',
            'status' => 'pending',
            'raw_text' => 'Sample OCR Text',
        ]);

        $exception = new \Exception('LLM Error');
        $job = new ProcessAIResult('Sample OCR Text', 'invoice', $document->id);
        
        $job->failed($exception);

        $document->refresh();
        $this->assertEquals('failed', $document->status);
        $this->assertEquals('LLM Error', $document->error_message);
    }
}
