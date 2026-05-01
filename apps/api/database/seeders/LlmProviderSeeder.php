<?php

namespace Database\Seeders;

use App\Models\LlmProvider;
use Illuminate\Database\Seeder;

class LlmProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LlmProvider::updateOrCreate(
            ['name' => 'gemini'],
            [
                'is_default' => true,
                'is_active' => true,
                'priority' => 1,
                'base_url' => 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
                'api_key' => env('GEMINI_API_KEY'),
                'auth_type' => 'query_param',
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'payload_template' => [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => '{prompt}']
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => 4096,
                        'temperature' => 0.1,
                    ]
                ],
                'response_path' => 'candidates.0.content.parts.0.text',
                'default_model' => 'gemini-flash-latest',
            ]
        );

        LlmProvider::updateOrCreate(
            ['name' => 'groq'],
            [
                'is_default' => true,
                'is_active' => true,
                'priority' => 2,
                'base_url' => 'https://api.groq.com/openai/v1/chat/completions',
                'api_key' => env('GROQ_API_KEY'),
                'auth_type' => 'bearer',
                'payload_template' => [
                    'model' => '{model}',
                    'messages' => [
                        ['role' => 'user', 'content' => '{prompt}']
                    ],
                    'temperature' => 0.1,
                    'max_tokens' => 4096,
                ],
                'response_path' => 'choices.0.message.content',
                'default_model' => 'llama-3.1-8b-instant',
            ]
        );
    }
}
