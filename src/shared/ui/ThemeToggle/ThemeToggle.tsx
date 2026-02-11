'use client'

import { Moon, Sun } from 'lucide-react'
import { useAppearanceStore } from '@/features/settings/appearance/appearance.store'

export function ThemeToggle() {
  const theme = useAppearanceStore((state) => state.theme)
  const toggleTheme = useAppearanceStore((state) => state.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex items-center gap-2 rounded-md border
        bg-background px-3 py-2 text-sm text-foreground
        hover:bg-purple-50 hover:text-purple-600
        transition-colors
      "
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          Light mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Dark mode
        </>
      )}
    </button>
  )
}
