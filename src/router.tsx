import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AuthGuard } from './components/auth/AuthGuard'
import { LoginScreen } from './components/auth/LoginScreen'
import { OnboardingScreen } from './components/auth/OnboardingScreen'
import { QuestsScreen } from './components/quests/QuestsScreen'
import { VaultPlaceholder } from './components/placeholders/VaultPlaceholder'
import { CharacterPlaceholder } from './components/placeholders/CharacterPlaceholder'

// HubScreen added after Task 13 — import lazily to avoid circular dep during dev
const HubScreen = () => import('./components/hub/HubScreen').then(m => ({ default: m.HubScreen }))
import { lazy, Suspense } from 'react'
const LazyHub = lazy(HubScreen)

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
      { path: 'vault', element: <VaultPlaceholder /> },
      { path: 'character', element: <CharacterPlaceholder /> },
    ],
  },
  { path: '*', element: <Navigate to="/hub" replace /> },
])
