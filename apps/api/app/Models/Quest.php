<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quest extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'type',
        'action_type',
        'target_count',
        'xp_reward',
        'coin_reward',
    ];

    public function userQuests(): HasMany
    {
        return $this->hasMany(UserQuest::class);
    }
}
