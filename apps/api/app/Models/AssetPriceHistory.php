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
        'close_price',
        'open_price',
        'high_price',
        'low_price',
        'currency_id',
        'created_at',
    ];

    protected $casts = [
        'price_date' => 'date',
        'created_at' => 'datetime',
        'close_price' => 'decimal:2',
        'open_price' => 'decimal:2',
        'high_price' => 'decimal:2',
        'low_price' => 'decimal:2',
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
