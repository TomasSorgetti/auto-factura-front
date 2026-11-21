const WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2] as const
const PREFIXES = new Set(['20', '23', '24', '25', '26', '27', '30', '33', '34'])

export function normalizeCUIT(input: string): string {
  return input.replace(/[\s.-]/g, '')
}

export function formatCUIT(normalized: string): string {
  if (!/^\d{11}$/.test(normalized)) return normalized
  return `${normalized.slice(0, 2)}-${normalized.slice(2, 10)}-${normalized.slice(10)}`
}

export function isValidCUIT(normalized: string): boolean {
  if (!/^\d{11}$/.test(normalized) || !PREFIXES.has(normalized.slice(0, 2))) return false
  const sum = WEIGHTS.reduce((acc, weight, i) => acc + Number(normalized[i]) * weight, 0)
  const check = 11 - (sum % 11)
  if (check === 10) return false
  return Number(normalized[10]) === (check === 11 ? 0 : check)
}
