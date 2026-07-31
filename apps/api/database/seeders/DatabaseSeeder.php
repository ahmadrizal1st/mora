<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@morapi.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role' => 'owner',
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@morapi.com'],
            [
                'name' => 'User',
                'password' => bcrypt('password'),
                'role' => 'employee',
            ]
        );

        $this->call([
            TransactionSeeder::class,
            LlmProviderSeeder::class,
            GamificationSeeder::class,
        ]);
    }
}
