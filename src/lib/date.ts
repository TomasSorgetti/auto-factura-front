const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso + 'T00:00:00'))
}
