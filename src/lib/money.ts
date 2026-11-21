const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

const ARS_PATTERN = /^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{0,2})?$/

export function formatARS(cents: number): string {
  return formatter.format(cents / 100)
}

export function parseARSToCents(input: string): number | null {
  const clean = input.replace(/[\s$]/g, '')
  if (!ARS_PATTERN.test(clean)) return null
  const [integerPart = '', decimalPart = ''] = clean.split(',')
  const cents = Number(integerPart.replaceAll('.', '') + decimalPart.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents : null
}

const wholePesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export function formatWholeARS(cents: number): string {
  return wholePesos.format(cents / 100)
}
