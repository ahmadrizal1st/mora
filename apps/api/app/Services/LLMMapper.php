<?php

namespace App\Services;

use App\Models\LlmProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class LLMMapper
{
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

        $response = $request->post($url, $payload);

        if ($response->successful()) {
            $responseBody = $response->json();
            $extractedData = data_get($responseBody, $provider->response_path);
            return (string) $extractedData;
        }

        $errorBody = $response->body();
        throw new Exception("Provider {$provider->name} failed with status {$response->status()}: " . substr($errorBody, 0, 200));
    }

    protected function parseJson(string $text): array
    {
        $debugFile = storage_path('logs/llm_raw_last_response.json');
        file_put_contents($debugFile, $text);

        // 1. Pastikan Encoding UTF-8
        $clean = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
        $clean = trim($clean);

        // 2. Unescape jika teks dibungkus kutipan (ciri khas beberapa model Llama)
        if (str_starts_with($clean, '"') && str_ends_with($clean, '"')) {
            $clean = json_decode($clean) ?: stripslashes(substr($clean, 1, -1));
        }

        // 3. Ekstrak JSON dari Markdown atau Teks Biasa
        if (preg_match('/```(?:json)?\s*(.*?)\s*```/is', $clean, $matches)) {
            $clean = trim($matches[1]);
        } else {
            $startPos = strpos($clean, '{');
            if ($startPos === false) $startPos = strpos($clean, '[');
            
            $endObject = strrpos($clean, '}');
            $endArray  = strrpos($clean, ']');
            $endPos    = ($endObject !== false && $endArray !== false) ? max($endObject, $endArray) : ($endObject ?: $endArray);

            if ($startPos !== false && $endPos !== false && $endPos > $startPos) {
                $clean = substr($clean, $startPos, $endPos - $startPos + 1);
            }
        }

        // 4. Bersihkan karakter kontrol dan backslash liar yang merusak JSON
        $clean = preg_replace('/[\x00-\x1F\x7F]/', '', $clean);
        // Jika masih ada escaped quotes tapi di luar blok kutipan, bersihkan
        if (!json_decode($clean)) {
            $clean = str_replace(['\"', '\n', '\r'], ['"', "\n", "\r"], $clean);
        }

        // 5. Decode JSON
        $data = json_decode($clean, true);

        // 6. Fallback: Auto-Close Truncated JSON & Remove Comments
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Hapus komentar dulu
            $cleanFallback = preg_replace('#(?<!:)\/\/\s.*$#m', '', $clean);
            $data = json_decode($cleanFallback, true);

            // Jika masih gagal, coba auto-close bracket yang hilang akibat terpotong (truncated)
            if (json_last_error() !== JSON_ERROR_NONE) {
                $closings = ['}', ']}', '}]}', ']}]}'];
                foreach ($closings as $closing) {
                    $testData = json_decode($cleanFallback . $closing, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data = $testData;
                        $clean = $cleanFallback . $closing; // update for logging
                        break;
                    }
                }
            }
        }

        // 7. Final Validation
        if (json_last_error() !== JSON_ERROR_NONE) {
            $errorMsg = json_last_error_msg();
            Log::error("JSON Parse Error: {$errorMsg}. Raw snippet: " . substr($clean, 0, 100));
            throw new Exception("Gagal parse JSON: {$errorMsg}");
        }

        return $data ?: [];
    }
}
