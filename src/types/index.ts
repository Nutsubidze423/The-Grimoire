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

export type ExpenseCategory = 'Food & Dining' | 'Transport' | 'Shopping' | 'Bills & Utilities' | 'Entertainment' | 'Custom'

export interface Budget {
  id: string
  user_id: string
  category: ExpenseCategory
  month_year: string   // 'YYYY-MM'
  limit_amount: number
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  category: ExpenseCategory
  amount: number
  note: string | null
  expense_date: string  // 'YYYY-MM-DD'
  created_at: string
}

export interface SavingsVault {
  id: string
  user_id: string
  goal_name: string
  goal_amount: number
  saved_amount: number
  created_at: string
  updated_at: string
}

export type WorkoutIntensity = 'Light' | 'Medium' | 'Heavy'
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'Full Body'

export interface Workout {
  id: string
  user_id: string
  exercise_name: string
  muscle_group: MuscleGroup
  intensity: WorkoutIntensity
  xp_reward: number
  logged_at: string
  created_at: string
}
