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
     * @param string|null $userId
     * @return array
     * @throws Exception
     */
    public function map(string $prompt, ?string $userId = null): array
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

        $lastError = null;

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
        $request = Http::asJson()->timeout(120);

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
            return (string) $extractedData;
        }

        $errorBody = $response->body();
        Log::error("Provider {$provider->name} Error: " . $errorBody);
        throw new Exception("Provider {$provider->name} failed with status {$response->status()}: " . substr($errorBody, 0, 200));
    }

    protected function parseJson(string $text): array
    {
        $clean = trim($text);

        // Jika LLM menggunakan markdown code blocks (```json ... ```) 
        if (preg_match('/```(?:json)?\s*(.*?)\s*```/is', $clean, $matches)) {
            $clean = trim($matches[1]);
        } else {
            // Mencoba mengekstrak dari kurung kurawal/siku pertama hingga terakhir
            $startObject = strpos($clean, '{');
            $startArray  = strpos($clean, '[');
            
            $startPos = false;
            if ($startObject !== false && $startArray !== false) {
                $startPos = min($startObject, $startArray);
            } elseif ($startObject !== false) {
                $startPos = $startObject;
            } elseif ($startArray !== false) {
                $startPos = $startArray;
            }

            if ($startPos !== false) {
                $endObject = strrpos($clean, '}');
                $endArray  = strrpos($clean, ']');
                
                $endPos = false;
                if ($endObject !== false && $endArray !== false) {
                    $endPos = max($endObject, $endArray);
                } elseif ($endObject !== false) {
                    $endPos = $endObject;
                } elseif ($endArray !== false) {
                    $endPos = $endArray;
                }

                if ($endPos !== false && $endPos > $startPos) {
                    $clean = trim(substr($clean, $startPos, $endPos - $startPos + 1));
                }
            }
        }

        $data = json_decode($clean, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Gagal parse JSON dari LLM: " . json_last_error_msg() . ". Raw content: " . substr($text, 0, 100));
        }

        return $data;
    }
}
