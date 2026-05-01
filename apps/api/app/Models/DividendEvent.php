<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DividendEvent extends Model
{
    use HasUuids;

    protected $fillable = [
        'asset_id',
        'ex_date',
        'pay_date',
        'amount_per_share_raw',
        'currency_id',
    ];

    protected $casts = [
        'ex_date' => 'date',
        'pay_date' => 'date',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }
}
