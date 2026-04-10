import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from '../AuthGuard'
import { useAuthStore } from '../../../stores/authStore'

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signOut: vi.fn(),
    },
  },
}))

describe('AuthGuard', () => {
  it('redirects to /login when no session', () => {
    useAuthStore.setState({ session: null, loading: false })
    render(
      <MemoryRouter initialEntries={['/hub']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/hub" element={<AuthGuard><div>Hub</div></AuthGuard>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Hub')).not.toBeInTheDocument()
  })

  it('renders children when session exists', () => {
    useAuthStore.setState({ session: { user: { id: 'abc' } } as any, loading: false })
    render(
      <MemoryRouter initialEntries={['/hub']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/hub" element={<AuthGuard><div>Hub</div></AuthGuard>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Hub')).toBeInTheDocument()
  })
})
