import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { xpToNext } from '../lib/constants'
import type { Quest, QuestDifficulty, QuestCategory, QuestType } from '../types'

interface NewQuestInput {
  name: string
  difficulty: QuestDifficulty
  category: QuestCategory
  quest_type: QuestType
  due_date: string | null
  xp_reward: number
}

interface QuestState {
  quests: Quest[]
  loading: boolean
  fetchQuests: (userId: string) => Promise<void>
  addQuest: (userId: string, input: NewQuestInput) => Promise<void>
  completeQuest: (questId: string, userId: string) => Promise<void>
  deleteQuest: (questId: string) => Promise<void>
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  loading: false,

  fetchQuests: async (userId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (!error && data) set({ quests: data as Quest[] })
    set({ loading: false })
  },

  addQuest: async (userId: string, input: NewQuestInput) => {
    const { data, error } = await supabase
      .from('quests')
      .insert({ user_id: userId, ...input })
      .select()
      .single()
    if (!error && data) set({ quests: [data as Quest, ...get().quests] })
  },

  completeQuest: async (questId: string, userId: string) => {
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('quests')
      .update({ completed_at: now })
      .eq('id', questId)
    if (error) return

    set({
      quests: get().quests.map(q =>
        q.id === questId ? { ...q, completed_at: now } : q
      ),
    })

    const { data: statsData } = await supabase
      .from('user_stats')
      .select('xp, level, xp_to_next')
      .eq('user_id', userId)
      .single()
    if (!statsData) return

    const quest = get().quests.find(q => q.id === questId)
    if (!quest) return

    let newXp = statsData.xp + quest.xp_reward
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

  deleteQuest: async (questId: string) => {
    const { error } = await supabase.from('quests').delete().eq('id', questId)
    if (!error) set({ quests: get().quests.filter(q => q.id !== questId) })
  },
}))
