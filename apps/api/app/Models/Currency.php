<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'symbol', 'name', 'rate_to_idr', 'is_default', 'is_active'])]
class Currency extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'rate_to_idr' => 'float',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'updated_at' => 'datetime',
        ];
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
