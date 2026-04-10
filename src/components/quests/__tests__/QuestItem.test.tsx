import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QuestItem } from '../QuestItem'
import type { Quest } from '../../../types'

const baseQuest: Quest = {
  id: 'q1',
  user_id: 'u1',
  name: 'Slay the Dragon',
  difficulty: 'Hard',
  category: 'Personal',
  quest_type: 'oneoff',
  due_date: null,
  completed_at: null,
  xp_reward: 50,
  created_at: '2026-01-01T00:00:00Z',
}

describe('QuestItem', () => {
  it('renders quest name and difficulty', () => {
    render(<QuestItem quest={baseQuest} onComplete={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Slay the Dragon')).toBeInTheDocument()
    expect(screen.getByLabelText('Hard')).toBeInTheDocument()
  })

  it('calls onComplete when complete button is clicked', async () => {
    const onComplete = vi.fn()
    render(<QuestItem quest={baseQuest} onComplete={onComplete} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('Mark complete'))
    expect(onComplete).toHaveBeenCalledWith('q1')
  })

  it('completed quest has strikethrough style applied', () => {
    const completedQuest: Quest = { ...baseQuest, completed_at: '2026-01-02T00:00:00Z' }
    const { container } = render(
      <QuestItem quest={completedQuest} onComplete={vi.fn()} onDelete={vi.fn()} />
    )
    const row = container.firstChild as HTMLElement
    expect(row.className).toMatch(/completed/)
  })
})
