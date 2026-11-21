import { useSyncExternalStore } from 'react'

export const THEME = {
  light: 'light',
  dark: 'dark',
} as const

export type Theme = (typeof THEME)[keyof typeof THEME]

const STORAGE_KEY = 'af_theme'
const listeners = new Set<() => void>()

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === THEME.light || value === THEME.dark ? value : null
  } catch {
    return null
  }
}

function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? (matchMedia('(prefers-color-scheme: dark)').matches ? THEME.dark : THEME.light)
}

let current: Theme = THEME.light

function apply(theme: Theme) {
  current = theme
  document.documentElement.classList.toggle('dark', theme === THEME.dark)
  listeners.forEach((listener) => listener())
}

export function initTheme() {
  apply(resolveInitialTheme())
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
  }
  apply(theme)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, () => current)
}
