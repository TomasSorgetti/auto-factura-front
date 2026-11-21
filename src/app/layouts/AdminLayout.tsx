import { ChevronRight, PanelsTopLeft } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router'
import { AppSidebar } from '@/components/app/AppSidebar'
import { ThemeToggle } from '@/components/app/ThemeToggle'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AdminLayout() {
  const { pathname } = useLocation()
  const isClient = pathname.startsWith('/app/clients')
  const detail = isClient && pathname.split('/').filter(Boolean).length > 2
  const section = isClient ? 'Clientes' : pathname.startsWith('/app/settings') ? 'Configuración' : 'Inicio'
  return (
    <TooltipProvider>
      <SidebarProvider className="app-shell">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="workspace-bar">
            <SidebarTrigger aria-label="Abrir o cerrar menú" />
            <span className="workspace-divider" />
            <nav aria-label="Ruta de navegación">
              <PanelsTopLeft aria-hidden="true" />
              <span className="crumb-workspace">Mi espacio</span>
              <ChevronRight aria-hidden="true" />
              {detail ? (
                <>
                  <Link to="/app/clients">Clientes</Link>
                  <ChevronRight aria-hidden="true" />
                  <span>Detalle</span>
                </>
              ) : (
                <span>{section}</span>
              )}
            </nav>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <div className="workspace-page">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
