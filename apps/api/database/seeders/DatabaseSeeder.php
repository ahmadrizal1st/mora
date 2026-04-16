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
        User::factory()->owner()->create([
            'name' => 'Admin',
            'email' => 'admin@vistamora.com',
        ]);

        User::factory()->employee()->create([
            'name' => 'Budi Karyawan',
            'email' => 'budi@vistamora.com',
        ]);

        $this->call(TransactionSeeder::class);
    }
}
