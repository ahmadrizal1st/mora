<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class LLMMapper
{
    /**
     * Mencoba memproses prompt ke berbagai provider LLM secara berurutan (fallback).
     *
     * @param string $prompt
     * @return array
     * @throws Exception
     */
    public function map(string $prompt): array
    {
        // Urutan fallback: Gemini -> Groq -> OpenRouter
        $providers = ['gemini', 'groq', 'openrouter'];
        $lastException = null;

        foreach ($providers as $provider) {
            try {
                $result = $this->callProvider($provider, $prompt);
                
                if ($result) {
                    return $this->parseJson($result);
                }
            } catch (Exception $e) {
                Log::warning("LLM Provider {$provider} gagal: " . $e->getMessage());
                $lastException = $e;
                continue;
            }
        }

        throw new Exception("Semua LLM provider gagal memproses data. Terakhir: " . ($lastException ? $lastException->getMessage() : 'Unknown Error'));
    }

    /**
     * Memanggil provider yang spesifik.
     */
    protected function callProvider(string $provider, string $prompt): ?string
    {
        return match ($provider) {
            'gemini'     => $this->callGemini($prompt),
            'groq'       => $this->callGroq($prompt),
            'openrouter' => $this->callOpenRouter($prompt),
            default      => null,
        };
    }

    /**
     * Google AI Studio (Gemini 1.5 Flash)
     */
    protected function callGemini(string $prompt): ?string
    {
        $key = config('services.llm.gemini_key');
        if (!$key) throw new Exception("Gemini API Key tidak dikonfigurasi.");

        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$key}", [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if ($response->successful()) {
            return $response->json('candidates.0.content.parts.0.text');
        }

        Log::error("Gemini Error: " . $response->body());
        return null;
    }

    /**
     * Groq (Llama 3)
     */
    protected function callGroq(string $prompt): ?string
    {
        $key = config('services.llm.groq_key');
        if (!$key) throw new Exception("Groq API Key tidak dikonfigurasi.");

        $response = Http::withToken($key)->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama3-8b-8192',
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.1,
        ]);

        if ($response->successful()) {
            return $response->json('choices.0.message.content');
        }

        Log::error("Groq Error: " . $response->body());
        return null;
    }

    /**
     * OpenRouter (Universal Fallback)
     */
    protected function callOpenRouter(string $prompt): ?string
    {
        $key = config('services.llm.openrouter_key');
        if (!$key) throw new Exception("OpenRouter API Key tidak dikonfigurasi.");

        $response = Http::withToken($key)
            ->withHeaders([
                'HTTP-Referer' => config('app.url'),
                'X-Title' => 'Visatamora OCR'
            ])
            ->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'google/gemini-flash-1.5',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
            ]);

        if ($response->successful()) {
            return $response->json('choices.0.message.content');
        }

        Log::error("OpenRouter Error: " . $response->body());
        return null;
    }

    /**
     * Parse string response ke array, bersihkan markdown jika ada.
     */
    protected function parseJson(string $text): array
    {
        // Membersihkan markdown code blocks (```json ... ```) jika LLM menyertakannya
        $clean = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
        
        $data = json_decode($clean, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Gagal parse JSON dari LLM: " . json_last_error_msg() . ". Raw content: " . substr($clean, 0, 100));
        }

        return $data;
    }
}
