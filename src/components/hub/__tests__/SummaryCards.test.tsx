import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCards } from '../SummaryCards'

describe('SummaryCards', () => {
  it('renders streak count', () => {
    render(<SummaryCards streakCount={12} questsToday={3} questsTotal={8} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })
  it('renders quests today/total', () => {
    render(<SummaryCards streakCount={0} questsToday={3} questsTotal={8} />)
    expect(screen.getByText('3/8')).toBeInTheDocument()
  })
})
