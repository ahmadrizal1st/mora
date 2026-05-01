<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Watchlist extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'asset_id',
        'alert_price_low',
        'alert_price_high',
        'alert_enabled',
    ];

    protected $casts = [
        'alert_enabled' => 'boolean',
        'alert_price_low' => 'decimal:2',
        'alert_price_high' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
