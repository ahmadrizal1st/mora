<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['account_id', 'limit', 'total_amount', 'installment_amount', 'installment_type', 'due_date', 'notes'])]
class Credit extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'limit' => 'integer',
            'total_amount' => 'integer',
            'installment_amount' => 'integer',
            'due_date' => 'date',
            'created_at' => 'datetime',
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
