import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  enableAdvancedCredit: boolean
  toggleAdvancedCredit: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      enableAdvancedCredit: false,
      toggleAdvancedCredit: () => set((state) => ({ enableAdvancedCredit: !state.enableAdvancedCredit })),
    }),
    {
      name: 'user-settings-storage',
    }
  )
)
