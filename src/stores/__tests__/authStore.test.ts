import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithOtp: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}))

import { useAuthStore } from '../authStore'

beforeEach(() => {
  useAuthStore.setState({ session: null, loading: false })
})

describe('authStore', () => {
  it('initialises with null session and loading false', () => {
    const { session, loading } = useAuthStore.getState()
    expect(session).toBeNull()
    expect(loading).toBe(false)
  })

  it('setSession updates session', () => {
    const fakeSession = { user: { id: 'abc' } } as any
    useAuthStore.getState().setSession(fakeSession)
    expect(useAuthStore.getState().session).toBe(fakeSession)
  })

  it('signOut calls supabase.auth.signOut and clears session', async () => {
    const { supabase } = await import('../../lib/supabase')
    useAuthStore.setState({ session: { user: { id: 'abc' } } as any })
    await useAuthStore.getState().signOut()
    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(useAuthStore.getState().session).toBeNull()
  })
})
