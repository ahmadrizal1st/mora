<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\BudgetPlan;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Optional;

class BudgetPlanData extends Data
{
    public function __construct(
        public ?int $id,
        public int $user_id,
        public string $name,
        public string $method,
        public float $income_baseline,
        public string $duration,
        public bool $is_active,

        /** @var DataCollection<BudgetItemData>|Optional */
        public DataCollection|Optional $items,
    ) {}

    public static function fromModel(BudgetPlan $plan): self
    {
        return new self(
            id: $plan->id,
            user_id: $plan->user_id,
            name: $plan->name,
            method: $plan->method,
            income_baseline: (float) $plan->income_baseline,
            duration: $plan->duration,
            is_active: $plan->is_active,
            items: $plan->relationLoaded('items')
                ? BudgetItemData::collect($plan->items, DataCollection::class)
                : Optional::create(),
        );
    }
}
