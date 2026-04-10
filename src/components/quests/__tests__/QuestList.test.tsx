import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuestList } from '../QuestList'
import type { Quest } from '../../../types'

const makeQuest = (overrides: Partial<Quest> = {}): Quest => ({
  id: 'q1',
  user_id: 'u1',
  name: 'Test Quest',
  difficulty: 'Easy',
  category: 'Personal',
  quest_type: 'daily',
  due_date: null,
  completed_at: null,
  xp_reward: 10,
  created_at: '2026-01-01T00:00:00Z',
  ...overrides,
})

describe('QuestList', () => {
  it('renders active quests section', () => {
    const quests = [makeQuest({ id: 'q1', name: 'Active Quest' })]
    render(<QuestList quests={quests} onComplete={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('Active Quest')).toBeInTheDocument()
  })

  it('renders completed quests section', () => {
    const quests = [
      makeQuest({ id: 'q1', name: 'Done Quest', completed_at: '2026-01-02T00:00:00Z' }),
    ]
    render(<QuestList quests={quests} onComplete={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    expect(screen.getByText('Done Quest')).toBeInTheDocument()
  })

  it('shows placeholder when no active quests', () => {
    render(<QuestList quests={[]} onComplete={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('NO ACTIVE QUESTS')).toBeInTheDocument()
  })
})
