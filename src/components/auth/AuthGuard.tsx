import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const session = useAuthStore(s => s.session)
  const loading = useAuthStore(s => s.loading)

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}
