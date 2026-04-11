import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AuthGuard } from './components/auth/AuthGuard'
import { LoginScreen } from './components/auth/LoginScreen'
import { OnboardingScreen } from './components/auth/OnboardingScreen'
import { QuestsScreen } from './components/quests/QuestsScreen'
import { TreasuryScreen } from './components/treasury/TreasuryScreen'
import { CharacterPlaceholder } from './components/placeholders/CharacterPlaceholder'

// Lazy imports to avoid circular dep during dev
const HubScreen = () => import('./components/hub/HubScreen').then(m => ({ default: m.HubScreen }))
const WorkoutScreen = () => import('./components/workout/WorkoutScreen').then(m => ({ default: m.WorkoutScreen }))
import { lazy, Suspense } from 'react'
const LazyHub = lazy(HubScreen)
const LazyWorkout = lazy(WorkoutScreen)

export const router = createBrowserRouter([
  { path: '/login', element: <LoginScreen /> },
  { path: '/onboarding', element: <OnboardingScreen /> },
  {
    path: '/',
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/hub" replace /> },
      { path: 'hub', element: <Suspense fallback={null}><LazyHub /></Suspense> },
      { path: 'quests', element: <QuestsScreen /> },
      { path: 'training', element: <Suspense fallback={null}><LazyWorkout /></Suspense> },
      { path: 'vault', element: <TreasuryScreen /> },
      { path: 'character', element: <CharacterPlaceholder /> },
    ],
  },
  { path: '*', element: <Navigate to="/hub" replace /> },
])
