import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'sonner'
import { queryClient } from '@/app/queryClient'
import { beginEntryLoading } from '@/app/entryLoading'
import { router } from '@/app/router'
import { registerSessionExpiry } from '@/app/session'
import { initTheme, useTheme } from '@/lib/theme'
import './index.css'

registerSessionExpiry()
initTheme()
beginEntryLoading()

function ThemedToaster() {
  const theme = useTheme()
  return <Toaster theme={theme} position="bottom-right" richColors />
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ThemedToaster />
    </QueryClientProvider>
  </StrictMode>,
)
