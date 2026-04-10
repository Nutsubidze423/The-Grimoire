import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsPanel } from '../StatsPanel'
import { DEFAULT_STATS } from '../../../lib/constants'

describe('StatsPanel', () => {
  it('renders all 11 stat labels', () => {
    render(<StatsPanel stats={DEFAULT_STATS} />)
    expect(screen.getByText('STRENGTH')).toBeInTheDocument()
    expect(screen.getByText('COURAGE')).toBeInTheDocument()
  })
  it('renders stat values', () => {
    const stats = { ...DEFAULT_STATS, strength: 42 }
    render(<StatsPanel stats={stats} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
