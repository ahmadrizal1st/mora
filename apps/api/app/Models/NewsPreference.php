<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsPreference extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'topics',
        'asset_tickers',
    ];

    protected $casts = [
        'topics' => 'array',
        'asset_tickers' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
