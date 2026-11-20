import { createBrowserRouter, Navigate } from 'react-router'
import { AdminLayout } from '@/app/layouts/AdminLayout'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  {
    path: '/app',
    Component: AdminLayout,
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
