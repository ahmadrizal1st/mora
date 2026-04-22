<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    /**
     * List categories with optional type filter.
     */
    public static function list(?string $type = null): Collection
    {
        $query = Category::query()->orderBy('name');

        if ($type) {
            $query->byType($type);
        }

        return $query->get();
    }
}
