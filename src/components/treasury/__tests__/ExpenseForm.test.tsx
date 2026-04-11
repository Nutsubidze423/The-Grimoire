import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ExpenseForm } from '../ExpenseForm'

describe('ExpenseForm', () => {
  it('renders all form fields', () => {
    render(<ExpenseForm onSubmit={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByLabelText('AMOUNT')).toBeTruthy()
    expect(screen.getByLabelText('NOTE (OPTIONAL)')).toBeTruthy()
    expect(screen.getByLabelText('DATE')).toBeTruthy()
    expect(screen.getByText('LOG EXPENSE')).toBeTruthy()
  })

  it('submits with correct values', () => {
    const onSubmit = vi.fn()
    render(<ExpenseForm onSubmit={onSubmit} onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('AMOUNT'), { target: { value: '25.50' } })
    fireEvent.click(screen.getByText('LOG EXPENSE'))
    expect(onSubmit).toHaveBeenCalledWith('Food & Dining', 25.5, null, expect.any(String))
  })

  it('does not submit when amount is empty', () => {
    const onSubmit = vi.fn()
    render(<ExpenseForm onSubmit={onSubmit} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('LOG EXPENSE'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('AMOUNT REQUIRED')).toBeTruthy()
  })
})
