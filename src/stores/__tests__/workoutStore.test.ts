import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('../../lib/constants', async () => {
  const actual = await vi.importActual<typeof import('../../lib/constants')>('../../lib/constants')
  return { ...actual, XP_BY_INTENSITY: { Light: 5, Medium: 15, Heavy: 30 } }
})

import { useWorkoutStore } from '../workoutStore'
import { supabase } from '../../lib/supabase'

const mockWorkout = {
  id: 'w1',
  user_id: 'u1',
  exercise_name: 'Push-ups',
  muscle_group: 'Chest',
  intensity: 'Medium',
  xp_reward: 15,
  logged_at: '2026-04-11T10:00:00Z',
  created_at: '2026-04-11T10:00:00Z',
}

describe('workoutStore', () => {
  beforeEach(() => {
    useWorkoutStore.setState({ workouts: [], loading: false })
    vi.clearAllMocks()
  })

  it('fetchWorkouts populates store', async () => {
    const chain = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), limit: vi.fn() }
    chain.select.mockReturnValue(chain)
    chain.eq.mockReturnValue(chain)
    chain.order.mockReturnValue(chain)
    chain.limit.mockResolvedValue({ data: [mockWorkout], error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await useWorkoutStore.getState().fetchWorkouts('u1')
    expect(useWorkoutStore.getState().workouts).toHaveLength(1)
    expect(useWorkoutStore.getState().workouts[0].exercise_name).toBe('Push-ups')
  })

  it('fetchWorkouts handles error gracefully', async () => {
    const chain = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), limit: vi.fn() }
    chain.select.mockReturnValue(chain)
    chain.eq.mockReturnValue(chain)
    chain.order.mockReturnValue(chain)
    chain.limit.mockResolvedValue({ data: null, error: { message: 'fail' } })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await useWorkoutStore.getState().fetchWorkouts('u1')
    expect(useWorkoutStore.getState().workouts).toHaveLength(0)
    expect(useWorkoutStore.getState().loading).toBe(false)
  })

  it('deleteWorkout removes entry from store', async () => {
    useWorkoutStore.setState({ workouts: [mockWorkout as unknown as import('../../types').Workout] })
    const chain = { delete: vi.fn(), eq: vi.fn() }
    chain.delete.mockReturnValue(chain)
    chain.eq.mockResolvedValue({ error: null })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await useWorkoutStore.getState().deleteWorkout('w1')
    expect(useWorkoutStore.getState().workouts).toHaveLength(0)
  })

  it('deleteWorkout keeps store on error', async () => {
    useWorkoutStore.setState({ workouts: [mockWorkout as unknown as import('../../types').Workout] })
    const chain = { delete: vi.fn(), eq: vi.fn() }
    chain.delete.mockReturnValue(chain)
    chain.eq.mockResolvedValue({ error: { message: 'fail' } })
    ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain)

    await useWorkoutStore.getState().deleteWorkout('w1')
    expect(useWorkoutStore.getState().workouts).toHaveLength(1)
  })
})
