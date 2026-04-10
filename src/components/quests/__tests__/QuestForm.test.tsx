import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QuestForm } from '../QuestForm'

describe('QuestForm', () => {
  it('renders all form fields', () => {
    render(<QuestForm onSubmit={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByLabelText(/QUEST NAME/i)).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByLabelText(/CATEGORY/i)).toBeInTheDocument()
    expect(screen.getByText('DAILY')).toBeInTheDocument()
    expect(screen.getByText('ONE-OFF')).toBeInTheDocument()
    expect(screen.getByLabelText(/DUE DATE/i)).toBeInTheDocument()
  })

  it('calls onSubmit with correct xp_reward for selected difficulty', async () => {
    const onSubmit = vi.fn()
    render(<QuestForm onSubmit={onSubmit} onClose={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/QUEST NAME/i), 'My Quest')
    await userEvent.click(screen.getByText('Hard'))
    await userEvent.click(screen.getByText('ADD QUEST'))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'My Quest', difficulty: 'Hard', xp_reward: 50 })
    )
  })

  it('does not call onSubmit when name is empty', async () => {
    const onSubmit = vi.fn()
    render(<QuestForm onSubmit={onSubmit} onClose={vi.fn()} />)
    await userEvent.click(screen.getByText('ADD QUEST'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('NAME REQUIRED')).toBeInTheDocument()
  })
})
