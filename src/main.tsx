import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'sonner'
import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'
import { registerSessionExpiry } from '@/app/session'
import './index.css'

registerSessionExpiry()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster theme="light" position="bottom-right" richColors />
    </QueryClientProvider>
  </StrictMode>,
)
