<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'user_id', 'type', 'amount', 'currency_id', 'exchange_rate',
    'account_id', 'to_account_id', 'category_id',
    'status_id', 'recurring_type_id', 'budget_item_id', 'document_extraction_id',
    'split_bill_id', 'tx_date', 'input_method', 'merchant', 'notes',
    'dynamic_fields',
])]
class Transaction extends Model
{
    use HasFactory, HasUuids;

    
    public const TYPE_INCOME = 'income';
    public const TYPE_EXPENSE = 'expense';
    public const TYPE_TRANSFER = 'transfer';

    
    public const METHOD_MANUAL = 'manual';
    public const METHOD_VOICE = 'voice';
    public const METHOD_RECEIPT = 'receipt';
    public const METHOD_AUTOPILOT = 'autopilot';

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'exchange_rate' => 'float',
            'tx_date' => 'date',
            'dynamic_fields' => 'array',
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

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function recurringType(): BelongsTo
    {
        return $this->belongsTo(RecurringType::class);
    }

    public function budgetItem(): BelongsTo
    {
        return $this->belongsTo(BudgetItem::class);
    }

    public function documentExtraction(): BelongsTo
    {
        return $this->belongsTo(DocumentExtraction::class);
    }

    public function splitBill(): BelongsTo
    {
        return $this->belongsTo(SplitBill::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'transaction_tags');
    }
}
