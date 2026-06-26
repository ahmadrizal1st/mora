<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LlmProvider extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'is_default',
        'name',
        'base_url',
        'api_key',
        'default_model',
        'is_active',
        'priority',
        'last_rotated_at',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'last_rotated_at' => 'datetime',
    ];

    public function getAuthTypeAttribute()
    {
        return match (strtolower($this->name)) {
            'gemini' => 'query_param', // append ?key=API_KEY
            default => 'bearer',
        };
    }

    public function getHeadersAttribute()
    {
        return ['Content-Type' => 'application/json'];
    }

    public function getBaseUrlAttribute($value)
    {
        if ($value) {
            return $value;
        }

        return match (strtolower($this->name)) {
            'gemini' => 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
            'groq' => 'https://api.groq.com/openai/v1/chat/completions',
            'openai' => 'https://api.openai.com/v1/chat/completions',
            default => '',
        };
    }

    public function getPayloadTemplateAttribute()
    {
        if (strtolower($this->name) === 'gemini') {
            return [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => '{prompt}']
                        ]
                    ]
                ],
                'generationConfig' => [
                    'response_mime_type' => 'application/json'
                ]
            ];
        }

        // Groq / OpenAI standard
        return [
            'model' => '{model}',
            'response_format' => ['type' => 'json_object'],
            'messages' => [
                ['role' => 'user', 'content' => '{prompt}']
            ]
        ];
    }

    public function getResponsePathAttribute()
    {
        if (strtolower($this->name) === 'gemini') {
            return 'candidates.0.content.parts.0.text';
        }

        return 'choices.0.message.content';
    }
}
