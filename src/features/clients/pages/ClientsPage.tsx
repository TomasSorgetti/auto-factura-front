import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { EmptyState } from '@/components/app/EmptyState'
import { FormDialog } from '@/components/app/FormDialog'
import { ErrorState } from '@/components/app/ErrorState'
import { ListSkeleton } from '@/components/app/ListSkeleton'
import { PageHeader } from '@/components/app/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CLIENTS_PAGE_SIZE } from '@/features/clients/api'
import { ClientForm } from '@/features/clients/components/ClientForm'
import { ClientsTable } from '@/features/clients/components/ClientsTable'
import { useClients, useCreateClient } from '@/features/clients/queries'
import type { ClientInput, ClientStatus } from '@/features/clients/types'

const SEARCH_DEBOUNCE_MS = 300

function parseStatus(value: string | null): ClientStatus {
  return value === 'archived' ? 'archived' : 'active'
}

function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

export function ClientsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const status = parseStatus(searchParams.get('status'))
  const page = parsePage(searchParams.get('page'))
  const [search, setSearch] = useState(q)
  const [dialogOpen, setDialogOpen] = useState(false)

  const clients = useClients({ q, status, page })
  const create = useCreateClient()

  useEffect(() => {
    if (search.trim() === q) return
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (search.trim()) next.set('q', search.trim())
          else next.delete('q')
          next.delete('page')
          return next
        },
        { replace: true },
      )
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search, q, setSearchParams])

  function changeStatus(next: ClientStatus) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (next === 'active') params.delete('status')
      else params.set('status', next)
      params.delete('page')
      return params
    })
  }

  function changePage(next: number) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (next <= 1) params.delete('page')
      else params.set('page', String(next))
      return params
    })
  }

  async function createClient(input: ClientInput) {
    const client = await create.mutateAsync(input)
    setDialogOpen(false)
    void navigate(`/app/clients/${encodeURIComponent(client.id)}`)
  }

  const newClientButton = <Button onClick={() => setDialogOpen(true)}>Nuevo cliente</Button>
  const pageCount = clients.data ? Math.max(1, Math.ceil(clients.data.total / CLIENTS_PAGE_SIZE)) : 1
  const isFiltered = q !== '' || status === 'archived'

  function renderList() {
    if (clients.isPending) return <ListSkeleton />
    if (clients.isError) return <ErrorState error={clients.error} onRetry={() => void clients.refetch()} />
    if (clients.data.items.length === 0) {
      return isFiltered ? (
        <EmptyState title="No hay clientes que coincidan con la búsqueda." />
      ) : (
        <EmptyState title="Todavía no cargaste clientes." action={newClientButton} />
      )
    }
    return (
      <ClientsTable
        clients={clients.data.items}
        page={page}
        pageCount={pageCount}
        onPageChange={changePage}
        onOpen={(client) => void navigate(`/app/clients/${encodeURIComponent(client.id)}`)}
      />
    )
  }

  return (
    <>
      <PageHeader title="Clientes" description="A quiénes les facturás" actions={newClientButton} />
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex gap-2">
          <Button variant={status === 'active' ? 'default' : 'outline'} size="sm" onClick={() => changeStatus('active')}>
            Activos
          </Button>
          <Button
            variant={status === 'archived' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeStatus('archived')}
          >
            Archivados
          </Button>
        </div>
        <Input
          type="search"
          className="md:max-w-sm"
          aria-label="Buscar por razón social o CUIT"
          placeholder="Buscar por razón social o CUIT"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {renderList()}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Nuevo cliente"
        description="Cargá los datos fiscales. Después sumás los contactos."
      >
        <ClientForm onSubmit={createClient} submitLabel="Crear cliente" pending={create.isPending} />
      </FormDialog>
    </>
  )
}
