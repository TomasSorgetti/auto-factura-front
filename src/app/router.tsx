import { createBrowserRouter, Navigate, redirect, type LoaderFunctionArgs } from 'react-router'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { hasSessionHint, isSessionKnownExpired } from '@/lib/session'

function requireSession({ request }: LoaderFunctionArgs) {
  if (hasSessionHint() && !isSessionKnownExpired()) return null
  const url = new URL(request.url)
  return redirect('/login?next=' + encodeURIComponent(url.pathname + url.search))
}

function redirectIfSession() {
  return hasSessionHint() && !isSessionKnownExpired() ? redirect('/app') : null
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  {
    path: '/login',
    Component: AuthLayout,
    loader: redirectIfSession,
    children: [
      {
        index: true,
        lazy: () => import('@/features/auth/pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
      },
    ],
  },
  {
    path: '/app',
    Component: AdminLayout,
    loader: requireSession,
    children: [
      {
        index: true,
        lazy: () => import('@/features/dashboard/pages/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
      },
      {
        path: 'clients',
        lazy: () => import('@/features/clients/pages/ClientsPage').then((m) => ({ Component: m.ClientsPage })),
      },
      {
        path: 'settings',
        lazy: () => import('@/features/settings/pages/SettingsPage').then((m) => ({ Component: m.SettingsPage })),
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('@/features/errors/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
  },
])
