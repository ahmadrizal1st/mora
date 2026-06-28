<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\BudgetItem;
use Spatie\LaravelData\Optional;
use Spatie\LaravelData\DataCollection;

class BudgetItemData extends Data
{
    public function __construct(
        public ?string $id,
        public string $budget_plan_id,
        public string $name,
        public ?float $percentage,
        public ?float $amount_limit,
        public ?string $color,
        public ?string $icon,

        
        public DataCollection|Optional $categories,
    ) {}

    public static function fromModel(BudgetItem $item): self
    {
        return new self(
            id: $item->id,
            budget_plan_id: $item->budget_plan_id,
            name: $item->name,
            percentage: (float) $item->percentage,
            amount_limit: (float) $item->amount_limit,
            color: $item->color,
            icon: $item->icon,
            categories: $item->relationLoaded('categories')
                ? CategoryData::collect($item->categories, DataCollection::class)
                : Optional::create(),
        );
    }
}
