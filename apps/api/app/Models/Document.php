<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'user_id',
        'transaction_id',
        'doc_type',
        'file_path',
        'mime_type',
        'original_filename',
        'raw_text',
        'extracted_data',
        'status',
        'error_message',
    ];

    protected $casts = [
        'extracted_data' => 'array',
    ];
}
