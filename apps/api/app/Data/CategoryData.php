<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Category;

class CategoryData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $tx_type,
        public ?string $icon,
        public string $color,
        public bool $is_default,
    ) {}

    public static function fromModel(Category $category): self
    {
        return new self(
            id: $category->id,
            name: $category->name,
            tx_type: $category->tx_type,
            icon: $category->icon,
            color: $category->color,
            is_default: (bool) $category->is_default,
        );
    }
}
