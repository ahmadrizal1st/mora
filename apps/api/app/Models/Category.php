<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

#[Fillable(['name', 'tx_type', 'icon', 'color', 'is_default'])]
class Category extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Scope to filter by transaction type.
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('tx_type', $type);
    }
}
