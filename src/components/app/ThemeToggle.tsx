import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setTheme, THEME, useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const theme = useTheme()
  const isDark = theme === THEME.dark
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      onClick={() => setTheme(isDark ? THEME.light : THEME.dark)}
    >
      {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
    </Button>
  )
}
