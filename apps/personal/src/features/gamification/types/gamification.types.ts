export interface Pet {
  name: string
  level: number
  status: string
  image: string
}

export interface GamificationStats {
  current_rank: string
  total_xp: number
  total_badges: number
  total_achievements: number
  longest_streak: number
  current_streak: number
  pet: Pet
}

export interface Achievement {
  id: number | string
  title: string
  description: string
  progress: number
  target_label: string
  current_label: string
  status: 'locked' | 'unlocked' | 'completed'
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  icon: string
  color: string
  streak?: string
  reward_xp: number
}

export interface LeaderboardUser {
  id: string
  rank: number
  name: string
  avatar: string
  src: string | null
  xp: number
  isMe: boolean
  tier: string
}

export interface GamificationResponse<T> {
  status: string
  data: T
}

export interface ClaimResponse {
  status: string
  message: string
  data: {
    achievement_id: number | string
    xp_earned: number
    new_total_xp: number
  }
}
