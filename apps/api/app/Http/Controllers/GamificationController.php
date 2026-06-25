<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\GamificationService;

class GamificationController extends Controller
{
    private GamificationService $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * Get user gamification stats
     */
    public function stats(Request $request): JsonResponse
    {
        $stats = $this->gamificationService->getStats($request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }

    /**
     * Get user achievements
     */
    public function achievements(Request $request): JsonResponse
    {
        $achievements = $this->gamificationService->getAchievements($request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $achievements
        ]);
    }

    /**
     * Get weekly leaderboard
     */
    public function leaderboard(Request $request): JsonResponse
    {
        $leaderboard = $this->gamificationService->getLeaderboard($request->user()->id);

        return response()->json([
            'status' => 'success',
            'data' => $leaderboard
        ]);
    }

    /**
     * Claim reward for a completed achievement
     */
    public function claim(Request $request, $id): JsonResponse
    {
        try {
            $result = $this->gamificationService->claimAchievement($request->user()->id, $id);

            return response()->json([
                'status' => 'success',
                'message' => 'Achievement claimed successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
