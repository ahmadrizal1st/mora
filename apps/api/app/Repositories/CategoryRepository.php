<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    
    public static function list(?string $type = null, ?User $user = null): Collection
    {
        $query = Category::query()->orderBy('name');

        if ($type) {
            $query->byType($type);
        }

        if ($user) {
            $query->where(function($q) use ($user) {
                $q->whereNull('user_id')->orWhere('user_id', $user->id);
            });
        } else {
            $query->whereNull('user_id');
        }

        return $query->get();
    }
}
