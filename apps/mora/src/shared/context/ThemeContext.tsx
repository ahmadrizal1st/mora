// src/context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'

export interface ThemeConfig {
  theme: string
  'theme-base': string
  'theme-font': string
  'theme-primary': string
  'theme-radius': string
}

const DEFAULTS: ThemeConfig = {
  theme: 'light',
  'theme-base': 'stone',
  'theme-font': 'sans-serif',
  'theme-primary': 'orange',
  'theme-radius': '2',
}

const THEME_KEYS = Object.keys(DEFAULTS) as (keyof ThemeConfig)[]
const LS_PREFIX = 'tabler-'

interface ThemeContextValue {
  config: ThemeConfig
  /** Increments on every config change; use as key/dep to force re-render of imperative components */
  themeKey: number
  setThemeValue: (key: keyof ThemeConfig, value: string) => void
  resetTheme: () => void
  toggleDarkMode: () => void
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}

/** Read initial config: URL params > localStorage > defaults */
function loadInitialConfig(): ThemeConfig {
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

/** Apply all data-bs-* attributes to <html> element */
function applyToDOM(config: ThemeConfig) {
  const el = document.documentElement
  for (const key of THEME_KEYS) {
    el.setAttribute('data-bs-' + key, config[key])
  }
}

/** Sync URL search params without reload */
function syncURL(config: ThemeConfig) {
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(loadInitialConfig)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const themeKeyRef = useRef(0)
  const [themeKey, setThemeKey] = useState(0)

  // Apply to DOM whenever config changes, then bump themeKey so imperative components re-init
  useEffect(() => {
    applyToDOM(config)
    syncURL(config)
    // Use rAF to let CSS variables settle before bumping key
    const raf = requestAnimationFrame(() => {
      themeKeyRef.current += 1
      setThemeKey(themeKeyRef.current)
    })
    return () => cancelAnimationFrame(raf)
  }, [config])

  // Persist to localStorage whenever config changes
  useEffect(() => {
    for (const key of THEME_KEYS) {
      if (config[key] !== DEFAULTS[key]) {
        localStorage.setItem(LS_PREFIX + key, config[key])
      } else {
        localStorage.removeItem(LS_PREFIX + key)
      }
    }
  }, [config])

  const setThemeValue = useCallback((key: keyof ThemeConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetTheme = useCallback(() => {
    setConfig({ ...DEFAULTS })
    for (const key of THEME_KEYS) {
      localStorage.removeItem(LS_PREFIX + key)
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }))
  }, [])

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  return (
    <ThemeContext.Provider value={{
      config, themeKey, setThemeValue, resetTheme, toggleDarkMode,
      settingsOpen, openSettings, closeSettings,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}