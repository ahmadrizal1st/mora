import api from '@/shared/api/client'
import type { GamificationStats, Achievement, LeaderboardUser, GamificationResponse, ClaimResponse } from '../types/gamification.types'

export const gamificationService = {
  async getStats(): Promise<GamificationStats> {
    const response = await api.get<GamificationResponse<GamificationStats>>('/gamification/stats')
    return response.data.data
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<GamificationResponse<Achievement[]>>('/gamification/achievements')
    return response.data.data
  },

  async getLeaderboard(): Promise<LeaderboardUser[]> {
    const response = await api.get<GamificationResponse<LeaderboardUser[]>>('/gamification/leaderboard')
    return response.data.data
  },

  async claimAchievement(id: string | number): Promise<ClaimResponse> {
    const response = await api.post<ClaimResponse>(`/gamification/achievements/${id}/claim`)
    return response.data
  }
}
