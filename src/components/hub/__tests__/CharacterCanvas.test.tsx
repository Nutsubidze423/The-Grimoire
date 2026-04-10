import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { CharacterCanvas } from '../CharacterCanvas'

beforeEach(() => {
  const mockCtx = {
    drawImage: vi.fn(),
    clearRect: vi.fn(),
    scale: vi.fn(),
    imageSmoothingEnabled: true,
  }
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx) as any
})

describe('CharacterCanvas', () => {
  it('renders a canvas element', () => {
    const { container } = render(<CharacterCanvas />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('canvas has correct CSS dimensions', () => {
    const { container } = render(<CharacterCanvas />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas.style.width).toBe('96px')
    expect(canvas.style.height).toBe('96px')
  })
})
