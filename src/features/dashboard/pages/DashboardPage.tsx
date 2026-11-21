import { Plus, CalendarDays } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/app/PageHeader'
import { Button } from '@/components/ui/button'
import { ActivityCard } from '../components/ActivityCard'
import { BentoOverview } from '../components/BentoOverview'
import { BillingChart } from '../components/BillingChart'
import { EmissionSchedule } from '../components/EmissionSchedule'
import { SystemStatusCard } from '../components/SystemStatusCard'
import '../dashboard.css'

export function DashboardPage() {
  return (
    <div className="dashboard">
      <PageHeader
        title="Panel general"
        description="Tu facturación, cobros y automatizaciones en un solo lugar."
        actions={
          <Button asChild>
            <Link to="/app/clients?new=1">
              <Plus aria-hidden="true" />
              Nuevo cliente
            </Link>
          </Button>
        }
      />
      <div className="overview-heading">
        <h2>Resumen del mes</h2>
        <span className="demo-note">Datos de ejemplo</span>
        <span className="period-label">
          <CalendarDays />
          Noviembre 2026
        </span>
      </div>
      <BentoOverview />
      <div className="dashboard-panels">
        <BillingChart />
        <EmissionSchedule />
      </div>
      <div className="dashboard-panels">
        <ActivityCard />
        <SystemStatusCard />
      </div>
    </div>
  )
}
