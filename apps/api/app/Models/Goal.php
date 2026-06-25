<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Goal extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'linked_account_id',
        'name',
        'type',
        'target_amount',
        'current_amount',
        'currency_id',
        'deadline_date',
        'monthly_deposit',
        'icon',
        'color',
        'image_url',
    ];

    protected $casts = [
        'deadline_date' => 'date',
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'monthly_deposit' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function linkedAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'linked_account_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }
}
