import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ReportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informe del período</CardTitle>
        <CardDescription>Resumen armado con tus datos.</CardDescription>
        <CardAction>
          <Select defaultValue="2026-11">
            <SelectTrigger size="sm" aria-label="Período del informe">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-11">Noviembre 2026</SelectItem>
              <SelectItem value="2026-10">Octubre 2026</SelectItem>
              <SelectItem value="2026-09">Septiembre 2026</SelectItem>
              <SelectItem value="2026">Año 2026</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">
          En noviembre facturaste <strong className="tabular-nums">$ 1.200.000</strong> a 3 clientes y cobraste{' '}
          <strong className="tabular-nums">$ 900.000</strong>. Quedan <strong className="tabular-nums">$ 300.000</strong>{' '}
          pendientes, de los cuales <strong className="tabular-nums">$ 100.000</strong> están vencidos (Acme, 12 días).
          Llevás el 64% del tope de tu categoría: a este ritmo lo alcanzás en abril.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          <Download className="size-4" aria-hidden="true" />
          Exportar CSV
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="size-4" aria-hidden="true" />
          Exportar PDF
        </Button>
      </CardFooter>
    </Card>
  )
}
