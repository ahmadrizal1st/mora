<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id', 'transaction_id', 'document_type', 'file_path', 'mime_type',
    'original_filename', 'raw_text', 'parsed_data', 'status', 'error_message'
])]
class DocumentExtraction extends Model
{
    use HasUuids;

    protected function casts(): array
    {
        return [
            'parsed_data' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
