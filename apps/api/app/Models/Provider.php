<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'type',
        'logo_url',
        'color',
        'is_global',
        'user_id',
    ];

    protected $casts = [
        'is_global' => 'boolean',
    ];

    /**
     * Get the user that owns the provider (for custom providers).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the accounts associated with this provider.
     */
    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }
}
