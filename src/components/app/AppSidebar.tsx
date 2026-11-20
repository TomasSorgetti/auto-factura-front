import { LogOut, Receipt } from 'lucide-react'
import { Link } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogout, useMe } from '@/features/auth/queries'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const me = useMe()
  const logout = useLogout()
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
      <SidebarContent />
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
