<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningProgress extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'content_id',
        'content_type',
        'progress_pct',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
