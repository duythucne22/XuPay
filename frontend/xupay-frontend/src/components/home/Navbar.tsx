'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Shield, Menu, X, ChevronDown, ArrowRight, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/providers'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  companyName?: string // Optional
}

export default function Navbar({ companyName = 'XUPAY' }: NavbarProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const menuItems = [
    {
      label: 'Products',
      dropdown: [
        { name: 'Capital', href: '/products/capital' },
        { name: 'Business Card', href: '/products/cards' },
        { name: 'Insights', href: '/products/insights' },
      ],
    },
    { label: 'Team', href: '/team' },
    { 
      label: 'Resources', 
      dropdown: [
        { name: 'Blog', href: '/resources/blog' },
        { name: 'Case Studies', href: '/resources/stories' },
        { name: 'Help Center', href: '/help' },
      ]
    },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-border-neon)] py-4 shadow-[var(--shadow-neon-teal)]' 
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center min-w-0">
        
        {/* ================= LEFT SIDE (Logo + Nav) ================= */}
        <div className="flex items-center gap-12 min-w-0">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-neon-teal)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Wallet className="text-[var(--color-neon-teal)] relative z-10" size={scrolled ? 28 : 32} />
            </div>
            <span className={`font-bold bg-gradient-to-r from-[var(--color-neon-teal)] to-[var(--color-neon-purple)] bg-clip-text text-transparent transition-all duration-300 ${
              scrolled ? 'text-xl' : 'text-2xl'
            }`}>
              {companyName}
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative group h-full"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors text-[15px] font-medium focus:outline-none py-2">
                      {item.label}
                      <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-4 w-56"
                        >
                          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-neon)] rounded-xl shadow-[var(--shadow-neon-teal)] overflow-hidden p-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block w-full text-left px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-neon-teal)] transition-all text-sm rounded-lg"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors text-[15px] font-medium py-2"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE (Auth + Actions) ================= */}
        <div className="flex items-center gap-5 min-w-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-neon)]">
            <Shield size={12} className="text-[var(--color-neon-teal)]" />
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium tracking-wide uppercase">Secure</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors relative"
            aria-label="Toggle theme"
          >
             <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
          </button>

          <div className="block h-6 w-px bg-[var(--color-border-default)]" />

          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 rounded-full font-semibold bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-text-secondary)] transition-all text-sm"
            >
              Dashboard
            </motion.button>
          ) : (
            <>
              <Link 
                href="/login"
                className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors"
              >
                Sign in
              </Link>
              
              <Link href="/demo">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "var(--shadow-neon-teal)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-gradient-to-r from-[var(--color-neon-teal)] to-[var(--color-neon-teal-hover)] text-[var(--color-bg-primary)] transition-all text-sm"
                >
                  Get a Demo
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </>
          )}

          {/* === FIXED MOBILE TOGGLE (No Rectangle, Colored Icon) === */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[var(--color-neon-teal)] hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed inset-0 top-[70px] bg-[var(--color-bg-secondary)] z-40 overflow-y-auto border-t border-[var(--color-border-neon)]"
          >
            <div className="px-6 py-8 space-y-6">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-[var(--color-border-default)] pb-4 last:border-0">
                  <div className="font-semibold text-lg text-[var(--color-text-primary)] mb-4">{item.label}</div>
                  {item.dropdown ? (
                    <div className="grid grid-cols-1 gap-3 pl-4">
                      {item.dropdown.map((subItem) => (
                        <Link 
                          key={subItem.name} 
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)] transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                       href={item.href!}
                       onClick={() => setMobileMenuOpen(false)}
                       className="block pl-4 text-[var(--color-text-secondary)] hover:text-[var(--color-neon-teal)]"
                    >
                      Visit Page
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                <Link href="/login">
                  <button className="w-full py-3 rounded-xl border border-[var(--color-border-default)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-surface-hover)]">
                    Sign in
                  </button>
                </Link>
                <Link href="/demo">
                  <button className="w-full py-3 rounded-xl bg-[var(--color-neon-teal)] text-[var(--color-bg-primary)] font-bold hover:bg-[var(--color-neon-teal-hover)] shadow-[var(--shadow-neon-teal)]">
                    Get a Demo
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}