import { api } from '@/lib/api'
import type { FiscalSettings, FiscalSettingsInput } from '@/features/settings/types'

export function getSettings(signal?: AbortSignal) {
  return api.get<FiscalSettings | null>('/admin/settings', { signal })
}

export function updateSettings(input: FiscalSettingsInput) {
  return api.put<FiscalSettings>('/admin/settings', { body: input })
}
