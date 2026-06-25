import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gamificationService } from '../services/gamification.service'

export const gamificationKeys = {
  all: ['gamification'] as const,
  stats: () => [...gamificationKeys.all, 'stats'] as const,
  achievements: () => [...gamificationKeys.all, 'achievements'] as const,
  leaderboard: () => [...gamificationKeys.all, 'leaderboard'] as const,
}

export function useGamificationStats() {
  return useQuery({
    queryKey: gamificationKeys.stats(),
    queryFn: () => gamificationService.getStats(),
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: gamificationKeys.achievements(),
    queryFn: () => gamificationService.getAchievements(),
  })
}

export function useLeaderboard() {
  return useQuery({
    queryKey: gamificationKeys.leaderboard(),
    queryFn: () => gamificationService.getLeaderboard(),
  })
}

export function useClaimAchievement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => gamificationService.claimAchievement(id),
    onSuccess: () => {
      // Invalidate achievements to update status, and stats to update XP
      queryClient.invalidateQueries({ queryKey: gamificationKeys.achievements() })
      queryClient.invalidateQueries({ queryKey: gamificationKeys.stats() })
    },
  })
}
