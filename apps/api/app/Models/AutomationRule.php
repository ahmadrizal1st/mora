<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutomationRule extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'trigger_type',
        'condition',
        'action',
        'is_active',
        'last_triggered_at',
    ];

    protected $casts = [
        'condition' => 'array',
        'action' => 'array',
        'is_active' => 'boolean',
        'last_triggered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
