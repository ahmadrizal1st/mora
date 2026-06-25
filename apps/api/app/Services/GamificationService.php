<?php

namespace App\Services;

use App\Models\GamificationProfile;
use App\Models\Quest;
use App\Models\UserQuest;
use App\Models\Streak;
use Illuminate\Support\Facades\DB;

class GamificationService
{
    /**
     * Get user gamification statistics
     */
    public function getStats(string $userId): array
    {
        $profile = GamificationProfile::firstOrCreate(
            ['user_id' => $userId],
            ['xp' => 0, 'coins' => 0, 'gemfin' => 0, 'level' => 1]
        );

        // Get login streak or general streak
        $streak = Streak::firstOrCreate(
            ['user_id' => $userId, 'type' => 'login'],
            ['current_count' => 0, 'longest_count' => 0]
        );

        $totalBadges = DB::table('user_badges')->where('user_id', $userId)->count();
        $totalAchievements = Quest::where('type', 'achievement')->count();

        // Determine Rank based on XP
        $rank = $this->determineRank($profile->xp);

        // Determine Pet Status based on Streak
        $petStatus = $streak->current_count >= 3 ? 'Happy & Energized' : 'Needs attention';
        
        return [
            'current_rank' => $rank,
            'total_xp' => $profile->xp,
            'total_badges' => $totalBadges,
            'total_achievements' => $totalAchievements,
            'longest_streak' => $streak->longest_count,
            'current_streak' => $streak->current_count,
            'pet' => [
                'name' => 'Mora the Spirit',
                'level' => $profile->level,
                'status' => $petStatus,
                'image' => '/static/illustrations/streak/pet.gif'
            ]
        ];
    }

    /**
     * Get achievements for a user
     */
    public function getAchievements(string $userId): array
    {
        // Get all achievement quests
        $quests = Quest::where('type', 'achievement')->get();
        
        // Get user progress
        $userQuests = UserQuest::where('user_id', $userId)
            ->whereIn('quest_id', $quests->pluck('id'))
            ->get()
            ->keyBy('quest_id');

        $result = [];

        foreach ($quests as $quest) {
            $userQuest = $userQuests->get($quest->id);
            
            $progressCount = $userQuest ? $userQuest->progress_count : 0;
            $isCompleted = $userQuest ? $userQuest->is_completed : false;
            
            $status = 'locked';
            if ($isCompleted) {
                $status = 'completed';
            } elseif ($progressCount > 0) {
                $status = 'unlocked'; // Unlocked means started making progress
            }

            // Mock rarity logic for UI based on reward
            $rarity = 'Common';
            $color = 'orange';
            if ($quest->xp_reward >= 500) { $rarity = 'Legendary'; $color = 'red'; }
            elseif ($quest->xp_reward >= 200) { $rarity = 'Epic'; $color = 'purple'; }
            elseif ($quest->xp_reward >= 100) { $rarity = 'Rare'; $color = 'green'; }

            $result[] = [
                'id' => $quest->id,
                'title' => $quest->title,
                'description' => "Complete the {$quest->title} objective.", // In real app, add description to table
                'progress' => min(100, $quest->target_count > 0 ? round(($progressCount / $quest->target_count) * 100) : 0),
                'target_label' => $quest->target_count . ' ' . $quest->action_type,
                'current_label' => $progressCount . ' ' . $quest->action_type,
                'status' => $status,
                'rarity' => $rarity,
                'icon' => $this->getIconForQuest($quest->title),
                'color' => $color,
                'reward_xp' => $quest->xp_reward,
            ];
        }

        return $result;
    }

    /**
     * Get leaderboard (Top 10 users by XP)
     */
    public function getLeaderboard(string $currentUserId): array
    {
        $profiles = GamificationProfile::with('user:id,name,avatar')
            ->orderByDesc('xp')
            ->limit(10)
            ->get();

        $result = [];
        $rank = 1;

        foreach ($profiles as $profile) {
            $isMe = $profile->user_id === $currentUserId;
            
            $result[] = [
                'id' => $profile->user_id,
                'rank' => $rank++,
                'name' => $isMe ? 'You' : ($profile->user ? $profile->user->name : 'Unknown'),
                'avatar' => $profile->user ? substr($profile->user->name, 0, 2) : '??',
                'src' => $profile->user ? $profile->user->avatar : null,
                'xp' => $profile->xp,
                'isMe' => $isMe,
                'tier' => $this->determineTier($profile->xp),
            ];
        }

        // If current user not in top 10, we could append them at the bottom.
        // For MVP, we skip this complexity.

        return $result;
    }

    /**
     * Claim achievement reward
     */
    public function claimAchievement(string $userId, string $questId): array
    {
        return DB::transaction(function () use ($userId, $questId) {
            $quest = Quest::findOrFail($questId);
            
            // For MVP UI simulation, if they claim it, we force complete it if not already completed
            // In real app, we check if target is met first
            $userQuest = UserQuest::firstOrCreate(
                ['user_id' => $userId, 'quest_id' => $questId],
                ['progress_count' => $quest->target_count, 'is_completed' => false]
            );

            if ($userQuest->is_completed) {
                throw new \Exception('Achievement already claimed');
            }

            $userQuest->is_completed = true;
            $userQuest->completed_at = now();
            // Ensure progress is full
            $userQuest->progress_count = $quest->target_count;
            $userQuest->save();

            // Add XP
            $profile = GamificationProfile::firstOrCreate(
                ['user_id' => $userId],
                ['xp' => 0, 'level' => 1]
            );
            
            $profile->xp += $quest->xp_reward;
            $profile->save();

            return [
                'achievement_id' => $questId,
                'xp_earned' => $quest->xp_reward,
                'new_total_xp' => $profile->xp
            ];
        });
    }

    // --- Helper Methods ---

    private function determineRank(int $xp): string
    {
        if ($xp >= 20000) return 'Diamond';
        if ($xp >= 15000) return 'Platinum';
        if ($xp >= 10000) return 'Gold I';
        if ($xp >= 5000) return 'Silver III';
        if ($xp >= 2000) return 'Silver I';
        if ($xp >= 500) return 'Bronze III';
        return 'Bronze I';
    }

    private function determineTier(int $xp): string
    {
        if ($xp >= 15000) return 'Tier 1 Saver';
        if ($xp >= 5000) return 'Tier 2 Saver';
        return 'Tier 3 Saver';
    }

    private function getIconForQuest(string $title): string
    {
        $title = strtolower($title);
        if (str_contains($title, 'save') || str_contains($title, 'saver')) return 'pig-money';
        if (str_contains($title, 'budget')) return 'target-arrow';
        if (str_contains($title, 'debt')) return 'sword';
        if (str_contains($title, 'invest')) return 'chart-pie';
        if (str_contains($title, 'early')) return 'sun';
        if (str_contains($title, 'wealth')) return 'trending-up';
        return 'star';
    }
}
