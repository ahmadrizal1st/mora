<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            [
                'id' => Str::uuid(),
                'title' => 'First Transaction',
                'type' => 'achievement',
                'action_type' => 'Catat transaksi pertama',
                'target_count' => 1,
                'xp_reward' => 50,
                'coin_reward' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'Saving Champion',
                'type' => 'achievement',
                'action_type' => 'Menabung konsisten 7 hari',
                'target_count' => 7,
                'xp_reward' => 150,
                'coin_reward' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'Budget Master',
                'type' => 'achievement',
                'action_type' => 'Tetap di bawah budget 1 bulan',
                'target_count' => 1,
                'xp_reward' => 200,
                'coin_reward' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'Wealth Builder',
                'type' => 'achievement',
                'action_type' => 'Capai net worth 100 Juta',
                'target_count' => 1,
                'xp_reward' => 500,
                'coin_reward' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'Expense Tracker Pro',
                'type' => 'achievement',
                'action_type' => 'Catat 100 transaksi',
                'target_count' => 100,
                'xp_reward' => 250,
                'coin_reward' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('quests')->insert($achievements);
    }
}
