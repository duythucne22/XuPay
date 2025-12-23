/* ============================================
   APP SHELL - Main application layout wrapper
   Layer 6: Layout Component (root layout)
   ============================================ */

'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileSidebar } from './MobileSidebar'
import { cn } from '@/lib/cn'

// ============================================
// PROPS
// ============================================

interface AppShellProps {
  children: ReactNode
  className?: string
}

// ============================================
// COMPONENT
// ============================================

export function AppShell({ children, className }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar className="h-full" />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          className="flex-shrink-0"
        />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/30',
            className
          )}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max-width)', padding: 'var(--container-padding-y) var(--container-padding-x)' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
