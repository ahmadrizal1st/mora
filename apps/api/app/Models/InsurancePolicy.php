<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InsurancePolicy extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'policy_number',
        'provider_name',
        'type',
        'currency_id',
        'premium_period',
        'expiry_date',
        'coverage_amount',
        'premium_amount',
    ];

    protected $casts = [
        'coverage_amount' => 'decimal:2',
        'premium_amount' => 'decimal:2',
        'expiry_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }
}
