<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Currency;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'account_id' => Account::factory(),
            'name' => fake()->word(),
            'amount' => fake()->randomFloat(2, 50000, 500000),
            'currency_id' => Currency::factory(),
            'next_billing_date' => fake()->date('Y-m-d', '+1 month'),
            'auto_renew' => fake()->boolean(),
            'billing_cycle' => fake()->randomElement(['monthly', 'yearly']),
            'status' => fake()->randomElement(['active', 'inactive']),
            'icon' => fake()->word(),
            'color' => fake()->hexColor(),
        ];
    }
}
