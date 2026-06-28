<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Currency;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->word(),
            'currency_id' => Currency::factory(),
            'provider_id' => Provider::factory(),
            'account_type' => fake()->randomElement([Account::TYPE_CASH, Account::TYPE_BANK, Account::TYPE_EWALLET, Account::TYPE_INVESTMENT]),
            'color' => fake()->hexColor(),
            'logo' => fake()->imageUrl(),
            'is_archived' => false,
        ];
    }
}
