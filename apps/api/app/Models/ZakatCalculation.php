<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ZakatCalculation extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'zakat_type',
        'asset_value',
        'nisab_value',
        'zakat_due',
        'currency_id',
        'calculation_date',
        'is_paid',
        'transaction_id',
    ];

    protected $casts = [
        'calculation_date' => 'date',
        'is_paid' => 'boolean',
        'asset_value' => 'decimal:2',
        'nisab_value' => 'decimal:2',
        'zakat_due' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
