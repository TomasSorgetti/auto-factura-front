import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { KpiCard } from '@/components/app/KpiCard'
import { PageHeader } from '@/components/app/PageHeader'
import { Button } from '@/components/ui/button'
import { ActivityCard } from '@/features/dashboard/components/ActivityCard'
import { AttentionStrip } from '@/features/dashboard/components/AttentionStrip'
import { BillingChart } from '@/features/dashboard/components/BillingChart'
import { ClientShareChart } from '@/features/dashboard/components/ClientShareChart'
import { DebtAgingChart } from '@/features/dashboard/components/DebtAgingChart'
import { MonotributoChart } from '@/features/dashboard/components/MonotributoChart'
import { ReportCard } from '@/features/dashboard/components/ReportCard'
import { SystemStatusCard } from '@/features/dashboard/components/SystemStatusCard'
import { UpcomingCard } from '@/features/dashboard/components/UpcomingCard'
import { ALERTS, KPIS } from '@/features/dashboard/mock'

export function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <PageHeader
        title="Inicio"
        description="Qué tenés que hacer hoy, cómo venís y qué viene."
        actions={
          <Button asChild>
            <Link to="/app/clients">
              <Plus className="size-4" aria-hidden="true" />
              Nuevo cliente
            </Link>
          </Button>
        }
      />
      <AttentionStrip alerts={ALERTS} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.id} label={kpi.label} valueCents={kpi.valueCents} hint={kpi.hint} trend={kpi.trend} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        <div className="flex flex-col *:flex-1 md:col-span-2 xl:col-span-8">
          <MonotributoChart />
        </div>
        <div className="flex flex-col *:flex-1 md:col-span-2 xl:col-span-4">
          <ReportCard />
        </div>
        <div className="flex flex-col *:flex-1 xl:col-span-4">
          <BillingChart />
        </div>
        <div className="flex flex-col *:flex-1 xl:col-span-4">
          <ClientShareChart />
        </div>
        <div className="flex flex-col *:flex-1 md:col-span-2 xl:col-span-4">
          <DebtAgingChart />
        </div>
        <div className="flex flex-col *:flex-1 xl:col-span-5">
          <UpcomingCard />
        </div>
        <div className="flex flex-col *:flex-1 xl:col-span-4">
          <ActivityCard />
        </div>
        <div className="flex flex-col *:flex-1 md:col-span-2 xl:col-span-3">
          <SystemStatusCard />
        </div>
      </div>
    </div>
  )
}
