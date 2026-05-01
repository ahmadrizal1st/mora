<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetPriceHistory extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'asset_id',
        'price_date',
        'close_price_raw',
        'open_price_raw',
        'high_price_raw',
        'low_price_raw',
        'currency_id',
        'created_at',
    ];

    protected $casts = [
        'price_date' => 'date',
        'created_at' => 'datetime',
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
