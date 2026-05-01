<?php

namespace App\Services;

use App\Models\LlmProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class LLMMapper
{
    /**
     * Mencoba memproses prompt ke berbagai provider LLM secara berurutan (fallback).
     *
     * @param string $prompt
     * @param int|null $userId
     * @return array
     * @throws Exception
     */
    public function map(string $prompt, ?int $userId = null): array
    {
        $providers = LlmProvider::where('is_active', true)
            ->where(function($q) use ($userId) {
                if ($userId) {
                    $q->where('user_id', $userId)->orWhere('is_default', true);
                } else {
                    $q->where('is_default', true);
                }
            })
            ->orderByRaw('user_id IS NULL ASC')
            ->orderBy('priority')
            ->get();

        if ($providers->isEmpty()) {
            throw new Exception("Tidak ada LLM provider yang aktif.");
        }

        $lastException = null;

        foreach ($providers as $provider) {
            try {
                $result = $this->executeProvider($provider, $prompt);
                
                if ($result) {
                    return $this->parseJson($result);
                }
            } catch (Exception $e) {
                Log::warning("LLM Provider {$provider->name} gagal: " . $e->getMessage());
                $lastError = $e->getMessage();
                continue;
            }
        }

        throw new Exception("Semua LLM provider gagal memproses data. Terakhir: " . ($lastError ?: 'Unknown Error'));
    }

    protected function executeProvider(LlmProvider $provider, string $prompt): ?string
    {
        $model = $provider->default_model ?? '';
        $payload = $provider->payload_template;

        array_walk_recursive($payload, function (&$value) use ($prompt, $model) {
            if (is_string($value)) {
                $value = str_replace(['{prompt}', '{model}'], [$prompt, $model], $value);
            }
        });

        $url = str_replace('{model}', $model, $provider->base_url);
        $request = Http::asJson();

        if ($provider->headers) {
            $request->withHeaders($provider->headers);
        }

        if ($provider->auth_type === 'bearer' && $provider->api_key) {
            $request->withToken($provider->api_key);
        } elseif ($provider->auth_type === 'query_param' && $provider->api_key) {
            $url .= (parse_url($url, PHP_URL_QUERY) ? '&' : '?') . 'key=' . urlencode($provider->api_key);
        } elseif ($provider->auth_type === 'header' && $provider->api_key) {
            $request->withHeaders(['Authorization' => $provider->api_key]);
        }

        Log::info("Executing LLM Request to: " . $url);
        Log::debug("Payload: " . json_encode($payload));

        $response = $request->post($url, $payload);

        if ($response->successful()) {
            $responseBody = $response->json();
            $extractedData = data_get($responseBody, $provider->response_path);
            Log::debug("Provider {$provider->name} Response: " . json_encode($extractedData));
            return $extractedData;
        }

        $errorBody = $response->body();
        Log::error("Provider {$provider->name} Error: " . $errorBody);
        throw new Exception("Provider {$provider->name} failed with status {$response->status()}: " . substr($errorBody, 0, 200));
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
