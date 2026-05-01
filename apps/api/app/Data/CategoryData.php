<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Category;

class CategoryData extends Data
{
    public function __construct(
        public ?string $id,
        public ?string $user_id,
        public ?string $parent_id,
        public string $name,
        public string $type,
        public ?string $icon,
        public ?string $color,
    ) {}

    public static function fromModel(Category $category): self
    {
        return new self(
            id: $category->id,
            user_id: $category->user_id,
            parent_id: $category->parent_id,
            name: $category->name,
            type: $category->type,
            icon: $category->icon,
            color: $category->color,
        );
    }
}
