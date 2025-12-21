/* ============================================
   TOPBAR - Top navigation bar
   Layer 6: Layout Component
   ============================================ */

'use client'

import { usePathname } from 'next/navigation'
import { findActiveNavItem } from '@/config/navigation'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from '@/components/common'
import { Bell, Menu, Search, Plus, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'

// ============================================
// PROPS
// ============================================

interface TopbarProps {
  onMenuClick?: () => void
  className?: string
}

// ============================================
// COMPONENT
// ============================================

export function Topbar({ onMenuClick, className }: TopbarProps) {
  const pathname = usePathname()
  const activeItem = findActiveNavItem(pathname)

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border/60',
        'bg-card supports-[backdrop-filter]:bg-card/70 backdrop-blur',
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Page Title */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold">{activeItem?.label ?? 'Dashboard'}</h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions, wallets..."
            className="pl-10 bg-bg-secondary border border-border rounded-lg focus-visible:ring-0 focus:border-primary"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {/* Notification Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </Button>

        {/* Quick Actions */}
        <Button variant="ghost" size="icon" aria-label="New">
          <Plus className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Command Palette">
          <Command className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        <div className="ml-2 pl-2 border-l border-border">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
