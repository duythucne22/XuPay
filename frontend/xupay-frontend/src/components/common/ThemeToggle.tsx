'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme === 'dark' || (!savedTheme && prefersDark)
  })

  const mounted = typeof window !== 'undefined'

  const toggleTheme = () => {
    const html = document.documentElement
    const newDarkMode = !isDark

    if (newDarkMode) {
      html.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }

    setIsDark(newDarkMode)
  }

  // Avoid hydration mismatch when rendering on server
  if (!mounted) {
    return <div className="p-2 w-9 h-9" />
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 hover:bg-[var(--xupay-surface-hover)] rounded-md transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-[var(--xupay-warning)]" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--xupay-text-secondary)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
