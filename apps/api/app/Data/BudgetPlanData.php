<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\BudgetPlan;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Optional;

class BudgetPlanData extends Data
{
    public function __construct(
        public ?string $id,
        public string $user_id,
        public string $name,
        public string $budget_method,
        public float $income_baseline,
        public string $period,
        public bool $is_active,
        public bool $rollover_enabled,

        /** @var DataCollection<BudgetItemData>|Optional */
        public DataCollection|Optional $items,
    ) {}

    public static function fromModel(BudgetPlan $plan): self
    {
        return new self(
            id: $plan->id,
            user_id: $plan->user_id,
            name: $plan->name,
            budget_method: $plan->budget_method,
            income_baseline: (float) $plan->income_baseline,
            period: $plan->period,
            is_active: $plan->is_active,
            rollover_enabled: $plan->rollover_enabled,
            items: $plan->relationLoaded('items')
                ? BudgetItemData::collect($plan->items, DataCollection::class)
                : Optional::create(),
        );
    }
}
