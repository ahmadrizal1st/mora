<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'base_currency', 'is_family_mode', 'theme', 'notification_preferences'])]
class UserSetting extends Model
{
    use HasUuids;

    protected function casts(): array
    {
        return [
            'is_family_mode' => 'boolean',
            'notification_preferences' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
