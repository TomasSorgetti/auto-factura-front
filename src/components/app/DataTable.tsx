import { tableFeatures, useTable, type ColumnDef, type RowData } from '@tanstack/react-table'
import type { KeyboardEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const features = tableFeatures({})

export type DataTableColumn<T extends RowData> = ColumnDef<typeof features, T>

type DataTablePagination = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

type DataTableProps<T extends RowData> = {
  columns: DataTableColumn<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  pagination?: DataTablePagination
  mobileCard: (row: T) => ReactNode
}

export function DataTable<T extends RowData>({ columns, data, onRowClick, pagination, mobileCard }: DataTableProps<T>) {
  const table = useTable({ features, columns, data })

  function onKeyDown(event: KeyboardEvent, row: T) {
    if (event.key === 'Enter' && onRowClick) onRowClick(row)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                role={onRowClick ? 'link' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={onRowClick ? 'cursor-pointer' : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                onKeyDown={onRowClick ? (event) => onKeyDown(event, row.original) : undefined}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}><table.FlexRender cell={cell} /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ul className="flex flex-col gap-3 md:hidden">
        {data.map((row, i) => (
          <li
            key={i}
            role={onRowClick ? 'link' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            className={onRowClick ? 'cursor-pointer' : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            onKeyDown={onRowClick ? (event) => onKeyDown(event, row) : undefined}
          >
            {mobileCard(row)}
          </li>
        ))}
      </ul>
      {pagination && pagination.pageCount > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            Página {pagination.page} de {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pageCount}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
