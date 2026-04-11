import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SavingsVaultCard } from '../SavingsVaultCard'
import type { SavingsVault } from '../../../types'

const mockVault: SavingsVault = {
  id: 'v1',
  user_id: 'u1',
  goal_name: 'Emergency Fund',
  goal_amount: 5000,
  saved_amount: 1200,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
}

describe('SavingsVaultCard', () => {
  it('renders vault progress when vault exists', () => {
    render(<SavingsVaultCard vault={mockVault} onUpdate={vi.fn()} />)
    expect(screen.getByText('Emergency Fund')).toBeTruthy()
    expect(screen.getByText('1200.00 / 5000.00')).toBeTruthy()
  })

  it('renders SET GOAL prompt when vault is null', () => {
    render(<SavingsVaultCard vault={null} onUpdate={vi.fn()} />)
    expect(screen.getByText('SET GOAL')).toBeTruthy()
    expect(screen.getByText('SAVINGS VAULT')).toBeTruthy()
  })
})
