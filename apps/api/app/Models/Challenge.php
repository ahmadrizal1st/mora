<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Challenge extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'description',
        'type',
        'target_amount',
        'start_date',
        'end_date',
        'reward_points',
        'is_active',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'reward_points' => 'integer',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ChallengeParticipant::class);
    }
}
