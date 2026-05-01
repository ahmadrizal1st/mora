<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountBalance extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'account_id',
        'period_month',
        'balance',
        'updated_at',
    ];

    protected $casts = [
        'period_month' => 'date',
        'balance' => 'decimal:2',
        'updated_at' => 'datetime',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
