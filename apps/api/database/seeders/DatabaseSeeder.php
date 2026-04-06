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
        // Admin HR (owner)
        User::factory()->owner()->create([
            'name' => 'Admin HR',
            'email' => 'admin@vistamora.com',
        ]);

        // Karyawan (employee)
        User::factory()->employee()->create([
            'name' => 'Budi Karyawan',
            'email' => 'budi@vistamora.com',
        ]);
    }
}
