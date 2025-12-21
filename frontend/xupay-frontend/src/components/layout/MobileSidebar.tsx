/* ============================================
   MOBILE SIDEBAR - Overlay sidebar for mobile
   Layer 6: Layout Component
   ============================================ */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { mainNavigation } from '@/config/navigation'
import { NavGroup } from './NavGroup'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

// ============================================
// PROPS
// ============================================

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

// ============================================
// COMPONENT
// ============================================

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border lg:hidden',
              'flex flex-col'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-xupay-primary to-xupay-secondary">
                  <span className="text-white font-bold text-sm">X</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-xupay-primary to-xupay-secondary bg-clip-text text-transparent">
                  XuPay
                </span>
              </Link>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
              {mainNavigation.map((group) => (
                <div key={group.label} onClick={onClose}>
                  <NavGroup group={group} />
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
