import type { STAT_KEYS } from '../lib/constants'

export type StatKey = typeof STAT_KEYS[number]

export type StatValues = Record<StatKey, number>

export interface GrimoireUser {
  id: string
  username: string
  avatarUrl: string | null
  createdAt: string
}

export interface UserStats {
  id: string
  userId: string
  level: number
  xp: number
  xpToNext: number
  streakCount: number
  lastActiveDate: string | null
  stats: StatValues
  updatedAt: string
}

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Legendary'
export type QuestType = 'daily' | 'oneoff' | 'boss' | 'side'
export type QuestCategory = 'Personal' | 'Work' | 'Errands' | 'Health' | 'Finance' | 'Social' | 'Learning' | 'Custom'

export interface Quest {
  id: string
  user_id: string
  name: string
  difficulty: QuestDifficulty
  category: QuestCategory
  quest_type: QuestType
  due_date: string | null
  completed_at: string | null
  xp_reward: number
  created_at: string
}
