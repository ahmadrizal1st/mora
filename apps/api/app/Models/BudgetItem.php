<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'budget_plan_id',
        'name',
        'percentage',
        'amount_limit',
        'color',
        'icon',
    ];

    protected $casts = [
        'percentage' => 'decimal:2',
        'amount_limit' => 'decimal:2',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(BudgetPlan::class, 'budget_plan_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'budget_item_categories');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
