import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              user_id: 'u1',
              level: 3,
              xp: 150,
              xp_to_next: 196,
              streak_count: 5,
              last_active_date: '2026-04-10',
              stats: {
                strength: 10, intelligence: 5, agility: 8, wisdom: 3,
                discipline: 7, vitality: 4, creativity: 2, charisma: 6,
                serenity: 1, endurance: 9, courage: 11,
              },
            },
            error: null,
          }),
        })),
      })),
    })),
  },
}))

import { useUserStore } from '../userStore'
import { DEFAULT_STATS } from '../../lib/constants'

beforeEach(() => {
  useUserStore.setState({
    username: '',
    level: 1,
    xp: 0,
    xpToNext: 100,
    streakCount: 0,
    lastActiveDate: null,
    stats: { ...DEFAULT_STATS },
  })
})

describe('userStore', () => {
  it('initialises with default values', () => {
    const state = useUserStore.getState()
    expect(state.level).toBe(1)
    expect(state.xp).toBe(0)
    expect(state.streakCount).toBe(0)
    expect(state.stats.strength).toBe(0)
  })

  it('fetchUserData populates state from Supabase row', async () => {
    await useUserStore.getState().fetchUserData('u1')
    const state = useUserStore.getState()
    expect(state.level).toBe(3)
    expect(state.xp).toBe(150)
    expect(state.streakCount).toBe(5)
    expect(state.stats.strength).toBe(10)
    expect(state.stats.courage).toBe(11)
  })

  it('setStats updates all stats', () => {
    const newStats = { ...DEFAULT_STATS, strength: 99 }
    useUserStore.getState().setStats(newStats)
    expect(useUserStore.getState().stats.strength).toBe(99)
  })
})
