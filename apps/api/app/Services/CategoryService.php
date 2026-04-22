<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * List all categories, optionally filtered by type.
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
