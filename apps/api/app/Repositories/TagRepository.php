<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TagRepository
{
    /**
     * Get all tags for a user.
     */
    public static function getAllForUser(User $user): Collection
    {
        return $user->tags()
            ->orderBy('name')
            ->get();
    }
}
