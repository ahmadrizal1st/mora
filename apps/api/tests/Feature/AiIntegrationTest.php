<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiIntegrationTest extends TestCase
{
    protected string $aiServiceUrl;

    protected function setUp(): void
    {
        parent::setUp();
        
        // URL service FastAPI, bisa disesuaikan dengan environment / config
        $this->aiServiceUrl = config('services.ai.url', 'http://localhost:8000/api/extract');
    }

    /**
     * Test case: Success response dengan confidence tinggi.
     */
    public function test_ai_success_response(): void
    {
        // Menggunakan Http::fake() untuk mem-mock response dari FastAPI
        // Hapus atau comment Http::fake() ini jika ingin melakukan real HTTP request ke OCR service yang menyala.
        Http::fake([
            '*' => Http::response([
                'success' => true,
                'text' => "NIK: 1234567890123456\nNama: JOHN DOE",
                'type' => 'KTP',
                'confidence' => 0.98,
                'engine_used' => 'surya_engine',
                'processing_time_ms' => 1250.5,
            ], 200),
        ]);

        // Simulasi file upload
        $file = UploadedFile::fake()->image('document.jpg');
        
        // Request menggunakan Http facade Laravel
        $response = Http::attach(
            'file', file_get_contents($file->getPathname()), $file->getClientOriginalName()
        )->post($this->aiServiceUrl);

        // Verifikasi Status Code
        $this->assertTrue($response->successful());
        
        // Verifikasi Struktur Data (Konsistensi Response)
        $data = $response->json();
        $this->assertIsArray($data);
        $expectedKeys = [
            'success',
            'text',
            'type',
            'confidence',
            'engine_used',
            'processing_time_ms',
        ];
        foreach ($expectedKeys as $key) {
            $this->assertArrayHasKey($key, $data);
        }

        // Verifikasi Value
        $this->assertTrue($data['success']);
        $this->assertEquals('KTP', $data['type']);
        $this->assertGreaterThan(0.8, $data['confidence']); // Confidence tinggi
    }

    /**
     * Test case: File tidak didukung (contoh: format file salah atau corrupt).
     */
    public function test_ai_unsupported_file_response(): void
    {
        Http::fake([
            '*' => Http::response([
                'success' => false,
                'detail' => 'File type not supported'
            ], 415), // HTTP 415 Unsupported Media Type atau 400 Bad Request
        ]);

        $file = UploadedFile::fake()->createWithContent('document.xyz', 'fake unreadable content');

        $response = Http::attach(
            'file', file_get_contents($file->getPathname()), $file->getClientOriginalName()
        )->post($this->aiServiceUrl);

        // Verifikasi Error HTTP Status
        $this->assertTrue($response->clientError());
        $this->assertEquals(415, $response->status());
        
        // Verifikasi format error handling
        $this->assertFalse($response->json('success'));
        $this->assertArrayHasKey('detail', $response->json());
    }

    /**
     * Test case: Response success tetapi dengan confidence rendah (buram/tidak terbaca).
     */
    public function test_ai_low_confidence_response(): void
    {
        Http::fake([
            '*' => Http::response([
                'success' => true,
                'text' => 'B!urry T#xt...',
                'type' => 'unknown',
                'confidence' => 0.45, // Confidence rendah di bawah threshold
                'engine_used' => 'pymupdf_engine',
                'processing_time_ms' => 850.2,
            ], 200),
        ]);

        $file = UploadedFile::fake()->image('blurry_document.jpg');

        $response = Http::attach(
            'file', file_get_contents($file->getPathname()), $file->getClientOriginalName()
        )->post($this->aiServiceUrl);

        $this->assertTrue($response->successful());
        
        // Struktur response tetap harus konsisten walau confidence rendah
        $data = $response->json();
        $expectedKeys = [
            'success',
            'text',
            'type',
            'confidence',
            'engine_used',
            'processing_time_ms',
        ];
        foreach ($expectedKeys as $key) {
            $this->assertArrayHasKey($key, $data);
        }

        $this->assertTrue($data['success']);
        
        // Verifikasi sistem bisa mendeteksi jika confidence rendah
        $this->assertLessThan(0.7, $data['confidence']);
    }
}
