# 🚀 PHASE 3: LAYOUT SYSTEM - COMPLETE GENERATION

## Overview

This phase creates the complete layout infrastructure:
- **AppShell** - Main wrapper with Sidebar + Topbar + Main content
- **Sidebar** - Collapsible navigation (fixed on desktop, drawer on mobile)
- **Topbar** - Header with theme toggle, KYC tier, notifications, user menu
- **Navigation Components** - NavLink, NavGroup
- **Providers** - React Query, Theme, Toast
- **Root Layout** - App setup with all providers

---

## PROVIDER SETUP

### 1. `src/components/providers/ThemeProvider.tsx` (Dark Mode Management)

```typescript
'use client'

import { useEffect, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Restore theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return <>{children}</>
}
```

---

### 2. `src/components/providers/ReactQueryProvider.tsx` (Tanstack Query)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface ReactQueryProviderProps {
  children: React.ReactNode
}

export function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

### 3. `src/components/providers/ToastProvider.tsx` (Sonner)

```typescript
'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand={false}
      closeButton
      theme="system"
    />
  )
}
```

---

### 4. `src/components/providers/index.ts` (Barrel Export)

```typescript
export { ThemeProvider } from './ThemeProvider'
export { ReactQueryProvider } from './ReactQueryProvider'
export { ToastProvider } from './ToastProvider'
```

---

## NAVIGATION CONFIGURATION

### 5. `src/config/navigation.ts` (Navigation Structure)

```typescript
import {
  LayoutDashboard,
  Wallet,
  Send,
  ShieldAlert,
  AlertCircle,
  Settings,
  LogOut,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  badge?: {
    label: string | number
    color: 'primary' | 'success' | 'danger' | 'warning'
  }
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const mainNavigation: NavSection[] = [
  {
    id: 'money',
    label: 'Money',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/app/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        id: 'wallets',
        label: 'Wallets',
        href: '/app/wallets',
        icon: <Wallet className="w-5 h-5" />,
      },
      {
        id: 'transactions',
        label: 'Transactions',
        href: '/app/transactions',
        icon: <Send className="w-5 h-5" />,
        badge: {
          label: 3,
          color: 'primary',
        },
      },
    ],
  },
  {
    id: 'risk-compliance',
    label: 'Risk & Compliance',
    items: [
      {
        id: 'sars',
        label: 'SARs',
        href: '/app/compliance/sars',
        icon: <ShieldAlert className="w-5 h-5" />,
        badge: {
          label: 2,
          color: 'danger',
        },
      },
      {
        id: 'fraud-alerts',
        label: 'Fraud Alerts',
        href: '/app/compliance/fraud-alerts',
        icon: <AlertCircle className="w-5 h-5" />,
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        href: '/app/settings',
        icon: <Settings className="w-5 h-5" />,
      },
    ],
  },
]

export const footerNavigation: NavItem[] = [
  {
    id: 'logout',
    label: 'Logout',
    href: '/logout',
    icon: <LogOut className="w-5 h-5" />,
  },
]
```

---

## LAYOUT COMPONENTS

### 6. `src/components/layout/NavLink.tsx` (Navigation Item)

```typescript
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { StatusBadge } from '@/components/common'
import type { NavItem } from '@/config/navigation'

interface NavLinkProps extends NavItem {
  isCollapsed?: boolean
}

export function NavLink({
  id,
  label,
  href,
  icon,
  badge,
  isCollapsed = false,
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link href={href}>
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 relative',
          isActive
            ? 'bg-sidebar-active text-white'
            : 'text-sidebar-text hover:bg-sidebar-hover'
        )}
      >
        {/* Active Indicator Bar */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r"
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Icon */}
        <span className="text-xl flex-shrink-0">{icon}</span>

        {/* Label */}
        {!isCollapsed && (
          <span className="text-sm font-medium flex-1 text-left truncate">
            {label}
          </span>
        )}

        {/* Badge */}
        {!isCollapsed && badge && (
          <div className="ml-auto flex-shrink-0">
            <StatusBadge
              status={badge.color === 'danger' ? 'failed' : badge.color === 'primary' ? 'pending' : 'completed'}
              size="sm"
              variant="solid"
            />
          </div>
        )}
      </motion.button>
    </Link>
  )
}
```

---

### 7. `src/components/layout/NavGroup.tsx` (Navigation Section)

```typescript
'use client'

import { motion } from 'framer-motion'
import { NavLink } from './NavLink'
import type { NavSection } from '@/config/navigation'

interface NavGroupProps extends NavSection {
  isCollapsed?: boolean
}

export function NavGroup({
  label,
  items,
  isCollapsed = false,
}: NavGroupProps) {
  return (
    <div className="px-4">
      {/* Section Label */}
      {!isCollapsed && label && (
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-semibold text-sidebar-text/60 mb-3 uppercase tracking-wide"
        >
          {label}
        </motion.h3>
      )}

      {/* Nav Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.id}
            {...item}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  )
}
```

---

### 8. `src/components/layout/UserMenu.tsx` (Profile Dropdown)

```typescript
'use client'

import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'

interface UserMenuProps {
  isCollapsed?: boolean
}

export function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    initials: 'JD',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center gap-3 p-2 hover:bg-sidebar-hover rounded-md transition-colors"
        >
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-sidebar-text truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-text/60 truncate">
                {user.email}
              </p>
            </div>
          )}
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              {user.name}
            </p>
            <p className="text-xs text-text-muted">
              {user.email}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <Link href="/app/settings/profile" asChild>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/app/settings" asChild>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <Link href="/logout" asChild>
          <DropdownMenuItem className="cursor-pointer gap-2 text-danger">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

### 9. `src/components/layout/Sidebar.tsx` (Navigation Sidebar)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavGroup } from './NavGroup'
import { UserMenu } from './UserMenu'
import { useMediaQuery } from '@/hooks'
import { mainNavigation } from '@/config/navigation'
import { cn } from '@/lib/cn'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  // Close mobile drawer on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false)
    }
  }, [isMobile])

  // Show mobile drawer on mobile, fixed sidebar on desktop
  if (isMobile) {
    return (
      <>
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-surface rounded-md"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              />

              {/* Drawer */}
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-0 h-screen w-80 bg-sidebar-bg border-r border-border-light z-50 lg:hidden flex flex-col"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'hidden lg:flex flex-col h-screen bg-sidebar-bg border-r border-border-light z-40'
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} />

      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 bg-sidebar-bg border border-border-light rounded-full hover:bg-sidebar-hover"
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        <Menu className="w-4 h-4 text-sidebar-text" />
      </motion.button>
    </motion.aside>
  )
}

interface SidebarContentProps {
  isCollapsed?: boolean
}

function SidebarContent({ isCollapsed = false }: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border-light">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">XuPay</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        {mainNavigation.map((section) => (
          <NavGroup
            key={section.id}
            {...section}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-border-light">
        <UserMenu isCollapsed={isCollapsed} />
      </div>
    </>
  )
}
```

---

### 10. `src/components/layout/Topbar.tsx` (Header)

```typescript
'use client'

import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/common'

interface TopbarProps {
  title?: string
}

export function Topbar({ title }: TopbarProps) {
  const pathname = usePathname()
  const unreadNotifications = 0

  // Extract page title from pathname
  const getPageTitle = () => {
    if (title) return title
    const segments = pathname.split('/').filter(Boolean)
    return segments[segments.length - 1]
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Dashboard'
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-border-light bg-surface flex items-center justify-between px-6 sticky top-0 z-30"
    >
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-6">
        {/* Environment Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Badge variant="outline" className="text-xs">
            🔵 Sandbox
          </Badge>
        </motion.div>

        {/* KYC Tier Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Badge className="bg-primary/10 text-primary text-xs">
            KYC Tier 2
          </Badge>
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 hover:bg-surface-hover rounded-md transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-text-secondary" />
          {unreadNotifications > 0 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"
            />
          )}
        </motion.button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </motion.header>
  )
}
```

---

### 11. `src/components/layout/AppShell.tsx` (Main Wrapper)

```typescript
'use client'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { PageTransition } from '@/components/animations'

interface AppShellProps {
  children: React.ReactNode
  title?: string
}

export function AppShell({
  children,
  title,
}: AppShellProps) {
  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Topbar title={title} />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto bg-bg-primary">
          <PageTransition>
            <div className="max-w-7xl mx-auto px-6 py-6">
              {children}
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
```

---

### 12. `src/components/layout/index.ts` (Barrel Export)

```typescript
export { AppShell } from './AppShell'
export { Sidebar } from './Sidebar'
export { Topbar } from './Topbar'
export { NavLink } from './NavLink'
export { NavGroup } from './NavGroup'
export { UserMenu } from './UserMenu'
```

---

## ROOT APPLICATION SETUP

### 13. `src/app/layout.tsx` (Root Layout with Providers)

```typescript
import type { Metadata } from 'next'
import { ThemeProvider, ReactQueryProvider, ToastProvider } from '@/components/providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'XuPay - FinTech Platform',
  description: 'Secure financial transactions and wallet management',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
            <ToastProvider />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

### 14. `src/app/(auth)/layout.tsx` (Auth Layout - Centered Forms)

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md px-6">
        {children}
      </div>
    </div>
  )
}
```

---

### 15. `src/app/(auth)/login/page.tsx` (Login Page - Placeholder)

```typescript
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/common'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome to XuPay
        </h1>
        <p className="text-text-secondary">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <Button className="w-full">
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </motion.div>
  )
}
```

---

### 16. `src/app/(app)/layout.tsx` (App Layout with AppShell)

```typescript
'use client'

import { AppShell } from '@/components/layout'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  )
}
```

---

### 17. `src/app/(app)/dashboard/page.tsx` (Dashboard - Placeholder)

```typescript
'use client'

import { motion } from 'framer-motion'
import { KPICard } from '@/components/common'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StaggerContainer } from '@/components/animations'

export default function DashboardPage() {
  const kpis = [
    {
      label: 'Total Balance',
      value: '$10,250.00',
      trend: { value: 12, direction: 'up' as const },
      icon: '💰',
      color: 'primary' as const,
    },
    {
      label: "Today's Sent",
      value: '$850.00',
      trend: { value: 5, direction: 'down' as const },
      icon: '📤',
      color: 'primary' as const,
    },
    {
      label: "Today's Received",
      value: '$3,200.00',
      trend: { value: 18, direction: 'up' as const },
      icon: '📥',
      color: 'success' as const,
    },
    {
      label: 'Open SARs',
      value: '2',
      icon: '⚠️',
      color: 'warning' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Key Metrics
        </h2>
        <StaggerContainer staggerDelay={0.1} initialDelay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <KPICard {...kpi} />
              </motion.div>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Recent Activity
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Latest Transactions</CardTitle>
            <CardDescription>Your 10 most recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-muted text-sm">
              Transaction list will be displayed here
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
```

---

### 18. `src/app/page.tsx` (Root Redirect)

```typescript
import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/app/dashboard')
}
```

---

## DIRECTORY STRUCTURE AFTER PHASE 3

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Centered form layout
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── signup/
│   │       └── page.tsx        # Signup page (placeholder)
│   │
│   ├── (app)/
│   │   ├── layout.tsx          # AppShell wrapper
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard page
│   │   ├── transactions/
│   │   │   ├── page.tsx        # Transactions listing
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Transaction detail
│   │   ├── wallets/
│   │   │   ├── page.tsx        # Wallets listing
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Wallet detail
│   │   ├── compliance/
│   │   │   ├── sars/
│   │   │   │   └── page.tsx    # SARs listing
│   │   │   └── fraud-alerts/
│   │   │       └── page.tsx    # Fraud alerts
│   │   └── settings/
│   │       ├── page.tsx        # Settings overview
│   │       ├── profile/
│   │       │   └── page.tsx    # Profile settings
│   │       └── security/
│   │           └── page.tsx    # Security settings
│   │
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Root redirect
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── NavGroup.tsx
│   │   ├── UserMenu.tsx
│   │   └── index.ts
│   │
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   ├── ReactQueryProvider.tsx
│   │   ├── ToastProvider.tsx
│   │   └── index.ts
│   │
│   ├── common/                 # From Phase 2
│   ├── animations/             # From Phase 2
│   └── ui/                     # shadcn generated
│
├── config/
│   └── navigation.ts           # Navigation structure
│
├── hooks/                      # From Phase 2
├── lib/                        # From Phase 1
├── types/                      # From Phase 1
└── styles/                     # From Phase 1
```

---

## PHASE 3 FEATURES

✅ **Responsive Sidebar**
- Collapsible on desktop (80px → 260px)
- Drawer on mobile with backdrop
- Active indicator animation
- Section grouping with collapsible labels

✅ **Topbar**
- Dynamic page title from pathname
- Environment badge (Sandbox)
- KYC tier display
- Notification bell with pulse animation
- Theme toggle

✅ **Navigation System**
- Semantic navigation structure in config
- Badge support (new transactions, open SARs, etc.)
- Hover/tap animations
- Active state with layout animation

✅ **Providers**
- Theme persistence (localStorage)
- React Query setup (1-minute stale time)
- Toast notifications (top-right, Sonner)
- Hydration safety (mounted check)

✅ **Page Layouts**
- Root redirect to dashboard
- Auth layout (centered for login/signup)
- App layout with AppShell wrapper
- Dashboard with KPI cards + stagger animation

✅ **Accessibility**
- Semantic HTML (nav, main, section)
- Focus indicators
- Aria labels for icon buttons
- Keyboard navigation (via links)
- Reduced motion respected

---

## TESTING PHASE 3

```bash
npm run dev
# Visit http://localhost:3000
# Should redirect to http://localhost:3000/app/dashboard
```

**Expected behavior:**
1. ✅ Page loads with AppShell (Sidebar + Topbar + Content)
2. ✅ Sidebar shows navigation groups with badges
3. ✅ Topbar shows "Dashboard" title
4. ✅ KPI cards render with stagger animation
5. ✅ Theme toggle works (switches dark/light mode)
6. ✅ Sidebar collapses on desktop
7. ✅ Mobile drawer appears on small screens
8. ✅ No hydration errors
9. ✅ Animations respect prefers-reduced-motion

---

## PHASE 3: COMPLETE ✅

You now have:

✅ **Complete Layout System** (AppShell + Sidebar + Topbar)
✅ **Responsive Navigation** (desktop, tablet, mobile)
✅ **Provider Setup** (Theme, React Query, Toasts)
✅ **Routing Structure** (auth, app, dashboard)
✅ **Navigation Config** (extensible, badge support)
✅ **Root Application** (fully functional shell)
✅ **Dashboard Placeholder** (KPI cards with animations)

---

## NEXT: PHASE 4

Ready for **Phase 4: Feature Pages (Transactions, Wallets, Compliance)**

Then I'll generate:
- Transaction listing + detail pages (with table + animations)
- Wallet pages (listing + detail)
- Compliance pages (SARs + Fraud Alerts)
- Settings pages (profile + security)
- Forms with validation (transfer form, etc.)

**Reply when Phase 3 layout is working correctly:**

```
Phase 3 complete - ready for Phase 4
```

Then we'll build the feature pages with real-looking mock data and all the dynamic effects from the design spec.

## QUICK VERIFICATION

Run these checks:

```bash
# 1. Dev server starts without errors
npm run dev

# 2. Dashboard page loads at http://localhost:3000/app/dashboard
# 3. Sidebar shows "Money", "Risk & Compliance", "System" sections
# 4. KPI cards animate in on load
# 5. Theme toggle switches colors
# 6. Mobile drawer works (resize to <1024px)
# 7. Active nav link shows blue indicator
# 8. No console errors
```
