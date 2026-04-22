<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'name', 'currency_id', 'color', 'type'])]
class Account extends Model
{
    public $timestamps = false;

    /**
     * Account type constants.
     */
    public const TYPE_CASH = 'cash';
    public const TYPE_BANK = 'bank';
    public const TYPE_EWALLET = 'e-wallet';
    public const TYPE_INVESTMENT = 'investment';

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

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

    public function credit(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Credit::class);
    }
}
