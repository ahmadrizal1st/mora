<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Quest;
use App\Models\User;
use App\Models\GamificationProfile;

class GamificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Achievements (Quests)
        $quests = [
            [
                'title' => 'Smart Saver',
                'type' => 'achievement',
                'action_type' => 'Months',
                'target_count' => 3,
                'xp_reward' => 100,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Budget Master',
                'type' => 'achievement',
                'action_type' => 'Month',
                'target_count' => 1,
                'xp_reward' => 200,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Debt Killer',
                'type' => 'achievement',
                'action_type' => '$',
                'target_count' => 5000,
                'xp_reward' => 500,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Investor Pro',
                'type' => 'achievement',
                'action_type' => 'Classes',
                'target_count' => 5,
                'xp_reward' => 150,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Early Bird',
                'type' => 'achievement',
                'action_type' => 'Days',
                'target_count' => 7,
                'xp_reward' => 50,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Wealth Creator',
                'type' => 'achievement',
                'action_type' => '%',
                'target_count' => 10,
                'xp_reward' => 200,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Subscription Ninja',
                'type' => 'achievement',
                'action_type' => 'Services',
                'target_count' => 3,
                'xp_reward' => 50,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Charity Champ',
                'type' => 'achievement',
                'action_type' => 'Orgs',
                'target_count' => 3,
                'xp_reward' => 100,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Emergency Fund',
                'type' => 'achievement',
                'action_type' => '$',
                'target_count' => 1000,
                'xp_reward' => 500,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Tax Optimizer',
                'type' => 'achievement',
                'action_type' => 'Maximized',
                'target_count' => 1,
                'xp_reward' => 200,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Portfolio Balanced',
                'type' => 'achievement',
                'action_type' => 'Within 5%',
                'target_count' => 1,
                'xp_reward' => 100,
                'coin_reward' => 0,
            ],
            [
                'title' => 'Credit Score Pro',
                'type' => 'achievement',
                'action_type' => 'Months',
                'target_count' => 6,
                'xp_reward' => 500,
                'coin_reward' => 0,
            ],
        ];

        foreach ($quests as $questData) {
            Quest::firstOrCreate(
                ['title' => $questData['title']],
                $questData
            );
        }

        // 2. Create Dummy Profiles for other users (for Leaderboard)
        $dummyUsers = [
            ['name' => 'Alex Johnson', 'xp' => 24500],
            ['name' => 'Sarah Miller', 'xp' => 21200],
            ['name' => 'Michael Chen', 'xp' => 11800],
            ['name' => 'Emma Wilson', 'xp' => 10500],
            ['name' => 'David Kim', 'xp' => 9200],
            ['name' => 'Jessica Lee', 'xp' => 8450],
            ['name' => 'Tom Hardy', 'xp' => 7800],
            ['name' => 'Linda Song', 'xp' => 7200],
            ['name' => 'Kevin Hart', 'xp' => 6500],
        ];

        foreach ($dummyUsers as $index => $u) {
            $user = User::firstOrCreate(
                ['email' => 'dummy' . $index . '@example.com'],
                [
                    'name' => $u['name'],
                    'password' => bcrypt('password'),
                    'role' => 'user'
                ]
            );

            GamificationProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'xp' => $u['xp'],
                    'coins' => 0,
                    'gemfin' => 0,
                    'level' => floor($u['xp'] / 1000) + 1
                ]
            );
        }

        // Ensure test users (user@morapi.com, admin@morapi.com) have GamificationProfiles
        $mainUsers = User::whereIn('email', ['user@morapi.com', 'admin@morapi.com'])->get();
        foreach ($mainUsers as $mainUser) {
            GamificationProfile::firstOrCreate(
                ['user_id' => $mainUser->id],
                [
                    'xp' => 12450,
                    'coins' => 100,
                    'gemfin' => 0,
                    'level' => 12
                ]
            );
        }
    }
}
