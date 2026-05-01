<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SplitParticipant extends Model
{
    use HasUuids;

    protected $fillable = [
        'split_bill_id',
        'user_id',
        'participant_name',
        'share_amount',
        'is_settled',
        'settled_at',
    ];

    protected $casts = [
        'is_settled' => 'boolean',
        'settled_at' => 'datetime',
        'share_amount' => 'decimal:2',
    ];

    public function splitBill(): BelongsTo
    {
        return $this->belongsTo(SplitBill::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
