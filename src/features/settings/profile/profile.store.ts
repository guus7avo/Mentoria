import { create } from 'zustand'

type ProfileState = {
  name: string
  email: string
  setName: (name: string) => void
  setEmail: (email: string) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  name: 'Gustavo',
  email: 'gustavo.nascimento@dtidigital.com',
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
}))
