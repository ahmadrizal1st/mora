<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyRecap extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'week_start_date',
        'total_income_raw',
        'total_expense_raw',
        'top_categories',
        'financial_health_score',
        'ai_insight',
    ];

    protected $casts = [
        'week_start_date' => 'date',
        'top_categories' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
