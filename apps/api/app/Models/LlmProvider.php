<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LlmProvider extends Model
{
    protected $fillable = [
        'user_id',
        'is_default',
        'name',
        'base_url',
        'api_key',
        'auth_type',
        'headers',
        'payload_template',
        'response_path',
        'default_model',
        'is_active',
        'priority',
        'last_rotated_at',
    ];

    protected $casts = [
        'api_key' => 'encrypted',
        'headers' => 'encrypted:array',
        'payload_template' => 'array',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'last_rotated_at' => 'datetime',
    ];
}
