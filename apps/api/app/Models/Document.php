<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'doc_type',
        'raw_text',
        'extracted_data',
        'status',
        'error_message',
    ];

    protected $casts = [
        'extracted_data' => 'array',
    ];
}
