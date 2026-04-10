import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/authStore'
import { useUserStore } from './stores/userStore'
import { router } from './router'

export function App() {
  const setSession = useAuthStore(s => s.setSession)
  const fetchUserData = useUserStore(s => s.fetchUserData)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) fetchUserData(data.session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) fetchUserData(session.user.id)
      }
    )

    return () => subscription.unsubscribe()
  }, [setSession, fetchUserData])

  return <RouterProvider router={router} />
}
