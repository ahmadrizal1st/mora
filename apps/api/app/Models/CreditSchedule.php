<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditSchedule extends Model
{
    use HasUuids;

    protected $fillable = [
        'credit_id',
        'due_date',
        'amount_due',
        'principal_portion',
        'interest_portion',
        'is_paid',
        'paid_date',
        'transaction_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_date' => 'date',
        'is_paid' => 'boolean',
        'amount_due' => 'decimal:2',
        'principal_portion' => 'decimal:2',
        'interest_portion' => 'decimal:2',
    ];

    public function creditAccount(): BelongsTo
    {
        return $this->belongsTo(CreditAccount::class, 'credit_id');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
