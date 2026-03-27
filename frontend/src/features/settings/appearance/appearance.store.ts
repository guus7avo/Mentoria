import { create } from 'zustand'

type Theme = 'light' | 'dark'

type AppearanceState = {
  theme: Theme
  toggleTheme: () => void
}

export const useAppearanceStore = create<AppearanceState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
}))
