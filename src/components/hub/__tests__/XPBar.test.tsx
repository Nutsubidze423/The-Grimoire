import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { XPBar } from '../XPBar'

describe('XPBar', () => {
  it('displays xp and xpToNext', () => {
    render(<XPBar xp={340} xpToNext={500} />)
    expect(screen.getByText('340 / 500')).toBeInTheDocument()
  })
  it('has EXPERIENCE label', () => {
    render(<XPBar xp={0} xpToNext={100} />)
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument()
  })
})
