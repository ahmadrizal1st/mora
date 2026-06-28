<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssetFactory extends Factory
{
    protected $model = Asset::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->word(),
            'category' => fake()->word(),
            'value' => fake()->randomFloat(2, 100000, 10000000),
            'purchase_date' => fake()->date('Y-m-d', '-1 year'),
            'notes' => fake()->sentence(),
        ];
    }
}
