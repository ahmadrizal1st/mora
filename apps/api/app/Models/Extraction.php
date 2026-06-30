<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Extraction extends Model
{
    protected $fillable = [
        'user_id', 'file_path', 'file_name', 'file_mime_type',
        'extraction_type', 'status', 'raw_text', 'error_message', 'transactions'
    ];

    protected $casts = [
        'transactions' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
