/* ============================================
   THEME PROVIDER - Dark/Light mode support
   Layer 5: React Provider
   ============================================ */

'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// ============================================
// TYPES
// ============================================

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

// ============================================
// CONTEXT
// ============================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// ============================================
// STORAGE KEY
// ============================================

const THEME_STORAGE_KEY = 'xupay_theme'

// ============================================
// PROVIDER
// ============================================

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  // Lazy initialize theme from storage where possible to avoid synchronous setState in effects
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = localStorage.getItem(storageKey) as Theme | null
    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    return mq.matches ? 'dark' : 'light'
  })

  // Resolve system theme and apply to document (only run on client)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      let resolved: 'light' | 'dark'

      if (theme === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light'
      } else {
        resolved = theme
      }

      setResolvedTheme(resolved)

      // Remove both classes first, then add the correct one
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    }

    applyTheme()

    // Listen for system theme changes
    mediaQuery.addEventListener('change', applyTheme)
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  // If rendering on server, short-circuit provider to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return (
      <ThemeContext.Provider value={{ theme: defaultTheme, resolvedTheme: 'light', setTheme }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
