/* ============================================
   NAV GROUP - Group of navigation links
   Layer 6: Layout Component
   ============================================ */

'use client'

import { NavLink } from './NavLink'
import type { NavGroup as NavGroupType } from '@/config/navigation'
import { cn } from '@/lib/cn'

// ============================================
// PROPS
// ============================================

interface NavGroupProps {
  group: NavGroupType
  collapsed?: boolean
}

// ============================================
// COMPONENT
// ============================================

export function NavGroup({ group, collapsed = false }: NavGroupProps) {
  return (
    <div className="space-y-1">
      {/* Group Label */}
      {!collapsed && (
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.label}
        </p>
      )}
      
      {/* Separator for collapsed mode */}
      {collapsed && (
        <div className="mx-2 my-2 h-px bg-border" />
      )}
      
      {/* Nav Items */}
      <nav className={cn('space-y-0.5', collapsed && 'space-y-1')}>
        {group.items.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </div>
  )
}
