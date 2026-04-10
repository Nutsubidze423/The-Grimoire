import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { DEFAULT_STATS } from '../lib/constants'
import type { StatValues } from '../types'

interface UserState {
  username: string
  level: number
  xp: number
  xpToNext: number
  streakCount: number
  lastActiveDate: string | null
  stats: StatValues

  fetchUserData: (userId: string) => Promise<void>
  setStats: (stats: StatValues) => void
  setUsername: (username: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  username: '',
  level: 1,
  xp: 0,
  xpToNext: 100,
  streakCount: 0,
  lastActiveDate: null,
  stats: { ...DEFAULT_STATS },

  fetchUserData: async (userId: string) => {
    const { data: statsData, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (statsError || !statsData) return

    set({
      level: statsData.level,
      xp: statsData.xp,
      xpToNext: statsData.xp_to_next,
      streakCount: statsData.streak_count,
      lastActiveDate: statsData.last_active_date ?? null,
      stats: statsData.stats as StatValues,
    })

    const { data: userData } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single()

    if (userData?.username) set({ username: userData.username })
  },

  setStats: (stats: StatValues) => set({ stats }),

  setUsername: (username: string) => set({ username }),
}))
