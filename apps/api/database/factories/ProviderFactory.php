<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderFactory extends Factory
{
    protected $model = Provider::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'logo_url' => fake()->imageUrl(),
            'type' => fake()->randomElement(['bank', 'ewallet', 'other']),
            'color' => fake()->hexColor(),
            'is_global' => true,
        ];
    }
}
