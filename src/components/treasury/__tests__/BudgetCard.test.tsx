import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BudgetCard } from '../BudgetCard'

describe('BudgetCard', () => {
  it('renders category name and spent/limit', () => {
    render(<BudgetCard category="Food & Dining" spent={50} limit={200} onSetLimit={vi.fn()} />)
    expect(screen.getByText('Food & Dining')).toBeTruthy()
    expect(screen.getByText('50.00 / 200.00')).toBeTruthy()
  })

  it('shows CURSED badge when over budget', () => {
    render(<BudgetCard category="Transport" spent={300} limit={200} onSetLimit={vi.fn()} />)
    expect(screen.getByText('CURSED')).toBeTruthy()
  })

  it('shows SET LIMIT when limit is 0', () => {
    render(<BudgetCard category="Shopping" spent={0} limit={0} onSetLimit={vi.fn()} />)
    expect(screen.getByText('SET LIMIT')).toBeTruthy()
  })
})
