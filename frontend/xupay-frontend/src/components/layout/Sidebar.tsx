/* ============================================
   SIDEBAR - Main navigation sidebar
   Layer 6: Layout Component
   ============================================ */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mainNavigation } from '@/config/navigation'
import { NavGroup } from './NavGroup'
import { cn } from '@/lib/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ============================================
// LOGO COMPONENT
// ============================================

interface LogoProps {
  collapsed?: boolean
}

function Logo({ collapsed }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 px-4 py-4 transition-colors hover:opacity-80"
    >
      {/* Logo Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-xupay-primary to-xupay-secondary">
        <span className="text-white font-bold text-sm">X</span>
      </div>
      
      {/* Logo Text */}
      {!collapsed && (
        <span className="text-xl font-bold bg-gradient-to-r from-xupay-primary to-xupay-secondary bg-clip-text text-transparent">
          XuPay
        </span>
      )}
    </Link>
  )
}

// ============================================
// SIDEBAR COMPONENT
// ============================================

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-border/60 transition-all duration-300',
        'bg-card supports-[backdrop-filter]:bg-card/80 backdrop-blur',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex-shrink-0 border-b border-border/60">
        <Logo collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {mainNavigation.map((group) => (
          <NavGroup key={group.label} group={group} collapsed={collapsed} />
        ))}
      </div>

      {/* Collapse Toggle */}
      <div className="flex-shrink-0 p-2 border-t border-border/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center justify-center w-full px-3 py-2 rounded-xl',
            'text-muted-foreground hover:text-foreground hover:bg-muted/40',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
