<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeParticipant extends Model
{
    use HasUuids;

    protected $fillable = [
        'challenge_id',
        'user_id',
        'progress_amount_raw',
        'is_winner',
        'joined_at',
    ];

    protected $casts = [
        'is_winner' => 'boolean',
        'joined_at' => 'datetime',
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
