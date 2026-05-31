import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import {
  ThemeContext,
  type ThemeConfig,
  loadInitialConfig,
  applyToDOM,
  syncURL,
  THEME_KEYS,
  DEFAULTS,
  LS_PREFIX,
} from '@/shared/context/ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(loadInitialConfig)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const themeKeyRef = useRef(0)
  const [themeKey, setThemeKey] = useState(0)

  useEffect(() => {
    applyToDOM(config)
    syncURL(config)

    const raf = requestAnimationFrame(() => {
      themeKeyRef.current += 1
      setThemeKey(themeKeyRef.current)
    })
    return () => cancelAnimationFrame(raf)
  }, [config])

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
    <ThemeContext.Provider
      value={{
        config,
        themeKey,
        setThemeValue,
        resetTheme,
        toggleDarkMode,
        settingsOpen,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
