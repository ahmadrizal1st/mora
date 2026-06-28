<?php

namespace Database\Factories;

use App\Models\BudgetItem;
use App\Models\BudgetPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetItemFactory extends Factory
{
    protected $model = BudgetItem::class;

    public function definition(): array
    {
        return [
            'budget_plan_id' => BudgetPlan::factory(),
            'name' => fake()->word(),
            'percentage' => fake()->randomFloat(2, 5, 50),
            'amount_limit' => fake()->randomFloat(2, 100000, 1000000),
            'color' => fake()->hexColor(),
            'icon' => fake()->word(),
        ];
    }
}
