<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'user_id', 'type', 'amount_raw', 'currency_id', 'rate_snapshot',
    'amount_in_default', 'account_id', 'to_account_id', 'category_id',
    'budget_item_id', 'status_id', 'recurring_type_id', 'tx_date', 'tracker', 'merchant', 'notes',
    'dynamic_fields',
])]
class Transaction extends Model
{
    public $timestamps = false;

    /**
     * Transaction type constants.
     */
    public const TYPE_INCOME = 'income';
    public const TYPE_EXPENSE = 'expense';
    public const TYPE_TRANSFER = 'transfer';

    protected function casts(): array
    {
        return [
            'amount_raw' => 'integer',
            'rate_snapshot' => 'float',
            'amount_in_default' => 'float',
            'tx_date' => 'date',
            'dynamic_fields' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function toAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'to_account_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function budgetItem(): BelongsTo
    {
        return $this->belongsTo(BudgetItem::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function recurringType(): BelongsTo
    {
        return $this->belongsTo(RecurringType::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'transaction_tags');
    }
}
