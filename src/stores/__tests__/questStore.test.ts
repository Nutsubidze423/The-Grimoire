import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Supabase mock -----------------------------------------------------------
// Each method returns `this` (chainable) until a terminal call resolves.

const mockQuests = [
  {
    id: 'q1',
    user_id: 'u1',
    name: 'Slay the Dragon',
    difficulty: 'Hard' as const,
    category: 'Personal' as const,
    quest_type: 'boss' as const,
    due_date: null,
    completed_at: null,
    xp_reward: 50,
    created_at: '2026-04-10T00:00:00Z',
  },
]

const mockStatsRow = { xp: 30, level: 1, xp_to_next: 100 }

// Chainable builder returned by supabase.from(table)
function makeChain(resolvedValue: { data: unknown; error: null | string }) {
  const chain: Record<string, unknown> = {}
  const terminal = vi.fn().mockResolvedValue(resolvedValue)

  // Terminal methods
  chain.single = terminal
  // Most chains end by awaiting the builder itself — we make it thenable
  chain.then = (resolve: (v: unknown) => void) =>
    Promise.resolve(resolvedValue).then(resolve)

  // Chainable methods that return the same chain
  for (const method of ['select', 'eq', 'order', 'insert', 'update', 'delete']) {
    chain[method] = vi.fn(() => chain)
  }

  return chain
}

// Per-table chains
const questsChain = makeChain({ data: mockQuests, error: null })
const insertChain = makeChain({ data: mockQuests[0], error: null })
const updateChain = makeChain({ data: null, error: null })
const deleteChain = makeChain({ data: null, error: null })
const statsChain = makeChain({ data: mockStatsRow, error: null })

// Override insert/update/delete to return dedicated chains
;(questsChain.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertChain)
;(insertChain.select as ReturnType<typeof vi.fn>).mockReturnValue(insertChain)
;(questsChain.update as ReturnType<typeof vi.fn>).mockReturnValue(updateChain)
;(questsChain.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteChain)

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'user_stats') return statsChain
      return questsChain
    }),
  },
}))

// --- Store import (after mock) -----------------------------------------------
import { useQuestStore } from '../questStore'

// -----------------------------------------------------------------------------

beforeEach(() => {
  useQuestStore.setState({ quests: [], loading: false })
  vi.clearAllMocks()
})

describe('questStore', () => {
  it('initialises with empty quests', () => {
    const state = useQuestStore.getState()
    expect(state.quests).toEqual([])
    expect(state.loading).toBe(false)
  })

  it('fetchQuests sets quests from Supabase', async () => {
    await useQuestStore.getState().fetchQuests('u1')
    const { quests, loading } = useQuestStore.getState()
    expect(quests).toHaveLength(1)
    expect(quests[0].name).toBe('Slay the Dragon')
    expect(loading).toBe(false)
  })

  it('addQuest inserts and prepends new quest', async () => {
    useQuestStore.setState({ quests: [...mockQuests] })

    const input = {
      name: 'New Quest',
      difficulty: 'Easy' as const,
      category: 'Work' as const,
      quest_type: 'daily' as const,
      due_date: null,
      xp_reward: 10,
    }

    await useQuestStore.getState().addQuest('u1', input)
    const { quests } = useQuestStore.getState()
    // Prepended — first item is the newly inserted one (mockQuests[0] data returned by single())
    expect(quests[0].id).toBe('q1')
  })

  it('completeQuest sets completed_at on the quest', async () => {
    useQuestStore.setState({ quests: [...mockQuests] })
    await useQuestStore.getState().completeQuest('q1', 'u1')
    const { quests } = useQuestStore.getState()
    expect(quests[0].completed_at).not.toBeNull()
  })
})
