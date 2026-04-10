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
