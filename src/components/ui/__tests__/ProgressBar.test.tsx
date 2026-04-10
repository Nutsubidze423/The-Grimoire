import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

describe('ProgressBar', () => {
  it('renders fill at correct percentage', () => {
    const { container } = render(<ProgressBar value={340} max={500} color="#c9a84c" />)
    const fill = container.querySelector('[data-testid="fill"]') as HTMLElement
    expect(fill.style.width).toBe('68%')
  })

  it('clamps at 100%', () => {
    const { container } = render(<ProgressBar value={600} max={500} color="#c9a84c" />)
    const fill = container.querySelector('[data-testid="fill"]') as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('clamps at 0%', () => {
    const { container } = render(<ProgressBar value={-10} max={500} color="#c9a84c" />)
    const fill = container.querySelector('[data-testid="fill"]') as HTMLElement
    expect(fill.style.width).toBe('0%')
  })
})
