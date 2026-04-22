<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * List all categories, optionally filtered by type.
     */
    public static function list(?string $type = null): Collection
    {
        return CategoryRepository::list($type);
    }
}
