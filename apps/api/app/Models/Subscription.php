<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'account_id',
        'last_transaction_id',
        'name',
        'amount',
        'currency_id',
        'next_billing_date',
        'auto_renew',
        'billing_cycle',
        'status',
        'icon',
        'color',
    ];

    protected $casts = [
        'next_billing_date' => 'date',
        'auto_renew' => 'boolean',
        'amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }
}
