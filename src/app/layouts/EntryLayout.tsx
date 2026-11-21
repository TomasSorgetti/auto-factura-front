import { Outlet } from 'react-router'
import { useFinishEntryLoading } from '@/app/entryLoading'

export function EntryLayout() {
  useFinishEntryLoading()
  return <Outlet />
}

export function EntryError() {
  useFinishEntryLoading()
  return (
    <main className="grid min-h-svh place-content-center justify-items-center gap-4">
      <h1 className="text-lg font-medium">No pudimos cargar la página.</h1>
      <button className="text-primary underline" onClick={() => window.location.reload()}>Volver a intentar</button>
    </main>
  )
}
