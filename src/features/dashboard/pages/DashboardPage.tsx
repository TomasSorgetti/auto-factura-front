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
      <ReportCard />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <MonotributoChart />
        </div>
        <BillingChart />
        <ClientShareChart />
        <DebtAgingChart />
        <UpcomingCard />
        <ActivityCard />
        <SystemStatusCard />
      </div>
    </div>
  )
}
