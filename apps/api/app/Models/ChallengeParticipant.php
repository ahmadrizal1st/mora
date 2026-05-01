<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeParticipant extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'challenge_id',
        'progress_amount',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'progress_amount' => 'decimal:2',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
