<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'type' => fake()->randomElement(['income', 'expense']),
            'icon' => fake()->word(),
            'color' => fake()->hexColor(),
        ];
    }
}
