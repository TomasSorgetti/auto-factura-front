import { createBrowserRouter, Navigate, redirect, type LoaderFunctionArgs } from 'react-router'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { hasSessionHint, isSessionKnownExpired } from '@/lib/session'

function requireSession({ request }: LoaderFunctionArgs) {
  if (hasSessionHint() && !isSessionKnownExpired()) return null
  const url = new URL(request.url)
  return redirect('/login?next=' + encodeURIComponent(url.pathname + url.search))
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  {
    path: '/app',
    Component: AdminLayout,
    loader: requireSession,
    children: [
      {
        index: true,
        lazy: () => import('@/features/dashboard/pages/DashboardPage').then((m) => ({ Component: m.DashboardPage })),
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('@/features/errors/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
  },
])
