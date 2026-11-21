import { LogOut, Receipt, Settings, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogout, useMe } from '@/features/auth/queries'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const me = useMe()
  const logout = useLogout()
  const { pathname } = useLocation()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/app">
                <Receipt className="size-4" aria-hidden="true" />
                <span>Auto Factura</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/app/clients')} tooltip="Clientes">
                <Link to="/app/clients">
                  <Users className="size-4" aria-hidden="true" />
                  <span>Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/app/settings')} tooltip="Configuración">
                <Link to="/app/settings">
                  <Settings className="size-4" aria-hidden="true" />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {me.isPending ? (
              <Skeleton className="mx-2 h-4 w-32" />
            ) : (
              <p className="truncate px-2 text-sm text-muted-foreground">
                {me.isError ? 'No pudimos cargar tu usuario.' : me.data.email}
              </p>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout.mutate()} disabled={logout.isPending}>
              <LogOut className="size-4" aria-hidden="true" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
