import { createContext, useContext } from 'react'

export interface ThemeConfig {
  theme: string
  'theme-base': string
  'theme-font': string
  'theme-primary': string
  'theme-radius': string
}

export const DEFAULTS: ThemeConfig = {
  theme: 'light',
  'theme-base': 'stone',
  'theme-font': 'sans-serif',
  'theme-primary': 'orange',
  'theme-radius': '2',
}

export const THEME_KEYS = Object.keys(DEFAULTS) as (keyof ThemeConfig)[]
export const LS_PREFIX = 'tabler-'

export interface ThemeContextValue {
  config: ThemeConfig

  themeKey: number
  setThemeValue: (key: keyof ThemeConfig, value: string) => void
  resetTheme: () => void
  toggleDarkMode: () => void
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}

export function loadInitialConfig(): ThemeConfig {
  const url = new URL(window.location.href)
  const config = { ...DEFAULTS }

  for (const key of THEME_KEYS) {
    const urlVal = url.searchParams.get(key)
    const lsVal = localStorage.getItem(LS_PREFIX + key)
    if (urlVal) {
      config[key] = urlVal
    } else if (lsVal) {
      config[key] = lsVal
    }
  }
  return config
}

export function applyToDOM(config: ThemeConfig) {
  const el = document.documentElement
  for (const key of THEME_KEYS) {
    const value = config[key]
    if (value) {
      el.setAttribute('data-bs-' + key, value)
    }
  }
}

export function syncURL(config: ThemeConfig) {
  const url = new URL(window.location.href)

  for (const key of THEME_KEYS) {
    if (config[key] !== DEFAULTS[key]) {
      url.searchParams.set(key, config[key])
    } else {
      url.searchParams.delete(key)
    }
  }

  window.history.replaceState({}, '', url.toString())
}
