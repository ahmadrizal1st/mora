<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['user_id', 'name', 'currency_id', 'provider_id', 'color', 'account_type', 'is_archived'])]
class Account extends Model
{
    use HasUuids;

    protected $casts = [
        'is_archived' => 'boolean',
    ];

    /**
     * Account type constants.
     */
    public const TYPE_CASH = 'cash';
    public const TYPE_BANK = 'bank';
    public const TYPE_EWALLET = 'e-wallet';
    public const TYPE_INVESTMENT = 'investment';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(Transaction::class, 'to_account_id');
    }

    public function credit(): HasOne
    {
        return $this->hasOne(CreditAccount::class);
    }

    public function balances(): HasMany
    {
        return $this->hasMany(AccountBalance::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
