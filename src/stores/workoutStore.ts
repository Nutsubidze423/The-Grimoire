import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { xpToNext, XP_BY_INTENSITY } from '../lib/constants'
import type { Workout, WorkoutIntensity, MuscleGroup } from '../types'

interface WorkoutState {
  workouts: Workout[]
  loading: boolean
  fetchWorkouts: (userId: string) => Promise<void>
  logWorkout: (userId: string, exerciseName: string, muscleGroup: MuscleGroup, intensity: WorkoutIntensity) => Promise<void>
  deleteWorkout: (workoutId: string) => Promise<void>
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  loading: false,

  fetchWorkouts: async (userId) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(30)
    if (!error && data) set({ workouts: data as Workout[] })
    set({ loading: false })
  },

  logWorkout: async (userId, exerciseName, muscleGroup, intensity) => {
    const xpReward = XP_BY_INTENSITY[intensity]
    const { data, error } = await supabase
      .from('workouts')
      .insert({ user_id: userId, exercise_name: exerciseName, muscle_group: muscleGroup, intensity, xp_reward: xpReward })
      .select()
      .single()
    if (error || !data) return

    set({ workouts: [data as Workout, ...get().workouts] })

    const { data: statsData } = await supabase
      .from('user_stats')
      .select('xp, level, xp_to_next')
      .eq('user_id', userId)
      .single()
    if (!statsData) return

    let newXp = statsData.xp + xpReward
    let newLevel = statsData.level
    let newXpToNext = statsData.xp_to_next

    while (newXp >= newXpToNext) {
      newXp -= newXpToNext
      newLevel++
      newXpToNext = xpToNext(newLevel)
    }

    await supabase
      .from('user_stats')
      .update({ xp: newXp, level: newLevel, xp_to_next: newXpToNext })
      .eq('user_id', userId)
  },

  deleteWorkout: async (workoutId) => {
    const { error } = await supabase.from('workouts').delete().eq('id', workoutId)
    if (!error) set({ workouts: get().workouts.filter(w => w.id !== workoutId) })
  },
}))
