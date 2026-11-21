import { ContactRound } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TAX_CONDITION_LABELS, type ClientDetail } from '@/features/clients/types'
import { formatCUIT } from '@/lib/cuit'

type ClientInfoCardProps = {
  client: ClientDetail
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="section-title"><ContactRound aria-hidden="true" />Datos fiscales</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">CUIT</dt>
            <dd className="font-mono">{formatCUIT(client.cuit)}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Condición frente al IVA</dt>
            <dd>{TAX_CONDITION_LABELS[client.taxCondition]}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Domicilio</dt>
            <dd>{client.address}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-1 text-sm">
          <h3 className="text-muted-foreground">Notas</h3>
          {client.notes ? <p className="whitespace-pre-wrap">{client.notes}</p> : <p>Sin notas.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
