import { Plus, Search } from 'lucide-react'
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
  const dialogOpen = searchParams.get('new') === '1'

  function setDialogOpen(open: boolean) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (open) next.set('new', '1')
      else next.delete('new')
      return next
    }, { replace: true })
  }

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
    const listParams = new URLSearchParams(searchParams)
    listParams.delete('new')
    await navigate({ pathname: '/app/clients', search: listParams.toString() }, { replace: true })
    await navigate(`/app/clients/${encodeURIComponent(client.id)}`)
  }

  const newClientButton = <Button onClick={() => setDialogOpen(true)}><Plus aria-hidden="true" />Nuevo cliente</Button>
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
      <section className="client-directory" aria-label="Directorio de clientes">
        <div className="directory-toolbar">
          <div className="status-options" role="group" aria-label="Estado del cliente">
            <button type="button" aria-pressed={status === 'active'} onClick={() => changeStatus('active')}>Activos</button>
            <button type="button" aria-pressed={status === 'archived'} onClick={() => changeStatus('archived')}>Archivados</button>
          </div>
          <label className="directory-search">
            <Search aria-hidden="true" />
            <Input
              type="search"
              aria-label="Buscar por razón social o CUIT"
              placeholder="Buscar por razón social o CUIT"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        <div className="directory-results">{renderList()}</div>
      </section>
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
