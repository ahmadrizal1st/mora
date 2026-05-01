<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'entity_type',
        'entity_id',
        'due_date',
        'notify_schedule',
        'is_sent',
    ];

    protected $casts = [
        'due_date' => 'date',
        'notify_schedule' => 'array',
        'is_sent' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
