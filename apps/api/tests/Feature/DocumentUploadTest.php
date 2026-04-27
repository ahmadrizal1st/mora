<?php

namespace Tests\Feature;

use App\Enums\DocumentSchema;
use App\Jobs\ProcessOCRResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class DocumentUploadTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_document_upload_requires_authentication(): void
    {
        $response = $this->postJson('/api/documents/upload', [
            'doc_type' => 'invoice',
            'file' => UploadedFile::fake()->image('invoice.jpg'),
        ]);

        $response->assertStatus(403); // Assuming ApiKeyMiddleware is active
    }

    public function test_document_upload_requires_valid_data(): void
    {
        $response = $this->actingAs($this->user)
            ->withHeader('X-API-KEY', env('API_KEY'))
            ->postJson('/api/documents/upload', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file', 'doc_type']);
    }

    public function test_document_upload_success(): void
    {
        Queue::fake();
        Http::fake([
            config('services.ocr.url', 'http://localhost:8000/api/extract') => Http::response([
                'success' => true,
                'text' => 'Sample OCR Text',
                'type' => 'invoice',
                'confidence' => 0.95,
                'processing_time_ms' => 100,
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-API-KEY', 'test_api_key')
            ->postJson('/api/documents/upload', [
                'doc_type' => 'invoice',
                'file' => UploadedFile::fake()->image('invoice.jpg'),
            ]);

        $response->assertStatus(202)
            ->assertJsonStructure(['message', 'document_id']);

        $this->assertDatabaseHas('documents', [
            'id' => $response->json('document_id'),
            'doc_type' => 'invoice',
            'status' => 'pending',
            'raw_text' => 'Sample OCR Text',
        ]);

        Queue::assertPushed(ProcessOCRResult::class, function ($job) use ($response) {
            return $job->getDocumentId() === $response->json('document_id');
        });
    }

    public function test_document_upload_fails_when_ocr_service_is_down(): void
    {
        Http::fake([
            config('services.ocr.url', 'http://localhost:8000/api/extract') => Http::response([], 503),
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-API-KEY', 'test_api_key')
            ->postJson('/api/documents/upload', [
                'doc_type' => 'invoice',
                'file' => UploadedFile::fake()->image('invoice.jpg'),
            ]);

        $response->assertStatus(502);
        $this->assertDatabaseEmpty('documents');
    }
}
