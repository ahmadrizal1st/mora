<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Currency;
use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoalFactory extends Factory
{
    protected $model = Goal::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'linked_account_id' => Account::factory(),
            'name' => fake()->word(),
            'type' => fake()->word(),
            'target_amount' => fake()->randomFloat(2, 100000, 1000000),
            'current_amount' => fake()->randomFloat(2, 0, 100000),
            'currency_id' => Currency::factory(),
            'deadline_date' => fake()->date('Y-m-d', '+1 year'),
            'monthly_deposit' => fake()->randomFloat(2, 10000, 100000),
            'icon' => fake()->word(),
            'color' => fake()->hexColor(),
        ];
    }
}
