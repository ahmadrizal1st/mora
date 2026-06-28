<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    
    public static function list(?string $type = null): Collection
    {
        return CategoryRepository::list($type);
    }
}
