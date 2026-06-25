<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the AI providers below you wish
    | to use as your default provider for all AI-related tasks.
    | Supported: "openai", "anthropic", "gemini", "groq", "ollama", "mistral"
    |
    */
    'default' => env('AI_DEFAULT_PROVIDER', 'groq'),

    /*
    |--------------------------------------------------------------------------
    | Default Models
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default models to use for each capability.
    | You can override these per-request in the services if needed.
    |
    */
    'models' => [
        'chat' => env('AI_CHAT_MODEL', 'llama-3.1-8b-instant'),
        'vision' => env('AI_VISION_MODEL', 'gemini-1.5-flash'),
        'audio' => env('AI_AUDIO_MODEL', 'whisper-large-v3'),
    ],
];
