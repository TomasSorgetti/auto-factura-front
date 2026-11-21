import { Outlet } from 'react-router'
import { AppSidebar } from '@/components/app/AppSidebar'
import { ThemeToggle } from '@/components/app/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AdminLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-muted/30">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger aria-label="Abrir o cerrar menú" />
            <Separator orientation="vertical" className="h-4" />
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
