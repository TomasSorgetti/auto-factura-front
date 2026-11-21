import { DataTable, type DataTableColumn } from '@/components/app/DataTable'
import { Card, CardContent } from '@/components/ui/card'
import { TAX_CONDITION_LABELS, type ClientSummary } from '@/features/clients/types'
import { formatCUIT } from '@/lib/cuit'

const COLUMNS: DataTableColumn<ClientSummary>[] = [
  { accessorKey: 'legalName', header: 'Razón social' },
  { accessorKey: 'cuit', header: 'CUIT', cell: ({ row }) => formatCUIT(row.original.cuit) },
  {
    accessorKey: 'taxCondition',
    header: 'Condición',
    cell: ({ row }) => TAX_CONDITION_LABELS[row.original.taxCondition],
  },
  {
    accessorKey: 'contactsCount',
    header: 'Contactos',
    cell: ({ row }) => <span className="tabular-nums">{row.original.contactsCount}</span>,
  },
]

function ClientCard({ client }: { client: ClientSummary }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <p className="font-medium">{client.legalName}</p>
        <p className="text-sm text-muted-foreground tabular-nums">{formatCUIT(client.cuit)}</p>
        <p className="text-sm text-muted-foreground">
          {TAX_CONDITION_LABELS[client.taxCondition]} ·{' '}
          <span className="tabular-nums">{client.contactsCount}</span> contactos
        </p>
      </CardContent>
    </Card>
  )
}

type ClientsTableProps = {
  clients: ClientSummary[]
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  onOpen: (client: ClientSummary) => void
}

export function ClientsTable({ clients, page, pageCount, onPageChange, onOpen }: ClientsTableProps) {
  return (
    <DataTable
      columns={COLUMNS}
      data={clients}
      onRowClick={onOpen}
      pagination={{ page, pageCount, onPageChange }}
      mobileCard={(client) => <ClientCard client={client} />}
    />
  )
}
