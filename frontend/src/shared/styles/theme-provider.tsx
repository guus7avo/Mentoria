'use client'

import { useEffect } from 'react'
import { useAppearanceStore } from '@/features/settings/appearance/appearance.store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppearanceStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return <>{children}</>
}
