import { LayoutDashboard, LogOut, Settings2, UserRound, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogout, useMe } from '@/features/auth/queries'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

const sections = [
  { title: 'Inicio', path: '/app', icon: LayoutDashboard },
  { title: 'Clientes', path: '/app/clients', icon: Users },
  { title: 'Configuración', path: '/app/settings', icon: Settings2 },
]

export function AppSidebar() {
  const me = useMe()
  const logout = useLogout()
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="brand-header">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Auto Factura" className="brand-link">
              <Link to="/app" onClick={() => setOpenMobile(false)} aria-label="Auto Factura, inicio">
                <img src="/favicon.svg" alt="" />
                <span>Auto Factura</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="nav-group">
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarMenu>
            {sections.map(({ title, path, icon: Icon }) => {
              const active = path === '/app' ? pathname === path : pathname.startsWith(path)
              return (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton asChild isActive={active} tooltip={title} className="nav-link">
                    <Link
                      to={path}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Icon aria-hidden="true" />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="account-footer">
        <div className="account-info">
          <span className="account-avatar">
            <UserRound size={15} />
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <b>Mi cuenta</b>
            {me.isPending ? (
              <Skeleton className="h-3 w-24" />
            ) : (
              <p>{me.isError ? 'Usuario no disponible' : me.data.email}</p>
            )}
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Cerrar sesión"
              aria-label="Cerrar sesión"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut aria-hidden="true" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
