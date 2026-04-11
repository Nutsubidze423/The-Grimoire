import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorkoutItem } from '../WorkoutItem'
import type { Workout } from '../../../types'

const mockWorkout: Workout = {
  id: 'w1',
  user_id: 'u1',
  exercise_name: 'Push-ups',
  muscle_group: 'Chest',
  intensity: 'Medium',
  xp_reward: 15,
  logged_at: '2026-04-11T10:00:00Z',
  created_at: '2026-04-11T10:00:00Z',
}

describe('WorkoutItem', () => {
  it('renders exercise name, muscle group, intensity, xp', () => {
    render(<WorkoutItem workout={mockWorkout} onDelete={vi.fn()} />)
    expect(screen.getByText('Push-ups')).toBeTruthy()
    expect(screen.getByText('Chest')).toBeTruthy()
    expect(screen.getByText('MEDIUM')).toBeTruthy()
    expect(screen.getByText('+15 XP')).toBeTruthy()
  })

  it('calls onDelete with workout id', () => {
    const onDelete = vi.fn()
    render(<WorkoutItem workout={mockWorkout} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('Delete workout'))
    expect(onDelete).toHaveBeenCalledWith('w1')
  })
})
