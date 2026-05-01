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
        'amount_due_raw',
        'principal_portion_raw',
        'interest_portion_raw',
        'is_paid',
        'paid_date',
        'transaction_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_date' => 'date',
        'is_paid' => 'boolean',
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
