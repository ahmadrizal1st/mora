<?php

namespace Database\Factories;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DebtFactory extends Factory
{
    protected $model = Debt::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'person_name' => fake()->name(),
            'description' => fake()->sentence(),
            'type' => fake()->randomElement(['borrow', 'lend']),
            'amount' => fake()->randomFloat(2, 10000, 100000),
            'amount_paid' => fake()->randomFloat(2, 0, 10000),
            'status' => fake()->randomElement(['active', 'paid']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'due_date' => fake()->date('Y-m-d', '+6 months'),
        ];
    }
}
