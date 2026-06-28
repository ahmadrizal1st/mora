<?php

namespace Database\Factories;

use App\Models\BudgetPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetPlanFactory extends Factory
{
    protected $model = BudgetPlan::class;

    public function definition(): array
    {
        $startDate = fake()->date('Y-m-01');
        $endDate = fake()->date('Y-m-t', $startDate);
        return [
            'user_id' => User::factory(),
            'name' => fake()->word(),
            'budget_method' => fake()->randomElement(['percentage', 'fixed']),
            'income_baseline' => fake()->randomFloat(2, 5000000, 20000000),
            'period' => fake()->randomElement(['monthly', 'yearly']),
            'is_active' => true,
            'rollover_enabled' => fake()->boolean(),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}
