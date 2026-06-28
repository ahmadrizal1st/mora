<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id', 'account_id', 'type', 'provider_name', 'principal_amount',
    'interest_rate', 'tenor_months', 'start_date', 'end_date', 'billing_cycle'
])]
class CreditAccount extends Model
{
    use HasUuids;

    protected function casts(): array
    {
        return [
            'principal_amount' => 'decimal:2',
            'interest_rate' => 'float',
            'tenor_months' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    protected $appends = ['limit', 'total_amount', 'installment_amount', 'due_date', 'credit_type'];

    public function getCreditTypeAttribute(): string
    {
        return $this->type;
    }

    public function getLimitAttribute(): float
    {
        return (float) $this->principal_amount;
    }

    public function getTotalAmountAttribute(): float
    {
        return (float) $this->principal_amount;
    }

    public function getInstallmentAmountAttribute(): float
    {
        if ($this->tenor_months > 0) {
            return (float) $this->principal_amount / $this->tenor_months;
        }
        return 0;
    }

    public function getDueDateAttribute(): ?string
    {
        $schedule = $this->schedules->where('is_paid', false)->sortBy('due_date')->first();
        return $schedule && $schedule->due_date ? $schedule->due_date->format('Y-m-d') : null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(CreditSchedule::class, 'credit_id');
    }
}
