import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/authStore'
import { useUserStore } from './stores/userStore'
import { useQuestStore } from './stores/questStore'
import { useTreasuryStore } from './stores/treasuryStore'
import { useWorkoutStore } from './stores/workoutStore'
import { router } from './router'

export function App() {
  const setSession = useAuthStore(s => s.setSession)
  const fetchUserData = useUserStore(s => s.fetchUserData)
  const fetchQuests = useQuestStore(s => s.fetchQuests)
  const fetchTreasury = useTreasuryStore(s => s.fetchTreasury)
  const fetchWorkouts = useWorkoutStore(s => s.fetchWorkouts)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        fetchUserData(data.session.user.id)
        fetchQuests(data.session.user.id)
        fetchTreasury(data.session.user.id)
        fetchWorkouts(data.session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) {
          fetchUserData(session.user.id)
          fetchQuests(session.user.id)
          fetchTreasury(session.user.id)
          fetchWorkouts(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setSession, fetchUserData, fetchQuests, fetchTreasury, fetchWorkouts])

  return <RouterProvider router={router} />
}
