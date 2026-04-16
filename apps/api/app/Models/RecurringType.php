<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'interval_days'])]
class RecurringType extends Model
{
    public $timestamps = false;

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
