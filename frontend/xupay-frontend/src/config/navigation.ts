/* ============================================
   NAVIGATION CONFIG - Sidebar navigation items
   Layer 6: Configuration
   ============================================ */

import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  ShieldAlert,
  Settings,
  BarChart3,
  FileText,
  Bell,
  type LucideIcon,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
  children?: NavItem[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// ============================================
// MAIN NAVIGATION
// ============================================

export const mainNavigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        label: 'Users',
        href: '/users',
        icon: Users,
      },
      {
        label: 'Wallets',
        href: '/wallets',
        icon: Wallet,
      },
      {
        label: 'Transactions',
        href: '/transactions',
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    label: 'Compliance',
    items: [
      {
        label: 'SAR Reports',
        href: '/sars',
        icon: ShieldAlert,
      },
      {
        label: 'Audit Log',
        href: '/audit',
        icon: FileText,
      },
    ],
  },
]

// ============================================
// USER MENU ITEMS
// ============================================

export const userMenuItems: NavItem[] = [
  {
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find the active nav item based on current pathname
 */
export function findActiveNavItem(pathname: string): NavItem | undefined {
  for (const group of mainNavigation) {
    for (const item of group.items) {
      if (pathname.startsWith(item.href)) {
        return item
      }
    }
  }
  return undefined
}

/**
 * Check if a nav item is active
 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  // Exact match for dashboard
  if (item.href === '/dashboard') {
    return pathname === '/dashboard'
  }
  // Prefix match for other routes
  return pathname.startsWith(item.href)
}
