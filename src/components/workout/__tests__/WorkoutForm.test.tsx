import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorkoutForm } from '../WorkoutForm'

describe('WorkoutForm', () => {
  it('renders exercise input, muscle group select, intensity buttons', () => {
    render(<WorkoutForm onSubmit={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByLabelText('EXERCISE')).toBeTruthy()
    expect(screen.getByLabelText('MUSCLE GROUP')).toBeTruthy()
    expect(screen.getByText('LIGHT')).toBeTruthy()
    expect(screen.getByText('MEDIUM')).toBeTruthy()
    expect(screen.getByText('HEAVY')).toBeTruthy()
  })

  it('shows error when submitted with empty name', () => {
    render(<WorkoutForm onSubmit={vi.fn()} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('LOG WORKOUT'))
    expect(screen.getByText('NAME REQUIRED')).toBeTruthy()
  })

  it('calls onSubmit with correct args', () => {
    const onSubmit = vi.fn()
    render(<WorkoutForm onSubmit={onSubmit} onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('EXERCISE'), { target: { value: 'Push-ups' } })
    fireEvent.click(screen.getByText('HEAVY'))
    fireEvent.click(screen.getByText('LOG WORKOUT'))
    expect(onSubmit).toHaveBeenCalledWith('Push-ups', 'Chest', 'Heavy')
  })

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn()
    render(<WorkoutForm onSubmit={vi.fn()} onClose={onClose} />)
    fireEvent.click(screen.getByText('CANCEL'))
    expect(onClose).toHaveBeenCalled()
  })
})
