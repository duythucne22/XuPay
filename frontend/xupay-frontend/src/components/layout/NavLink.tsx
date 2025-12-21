/* ============================================
   NAV LINK - Single navigation link component
   Layer 6: Layout Component
   ============================================ */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavItemActive, type NavItem } from '@/config/navigation'
import { cn } from '@/lib/cn'

// ============================================
// PROPS
// ============================================

interface NavLinkProps {
  item: NavItem
  collapsed?: boolean
}

// ============================================
// COMPONENT
// ============================================

export function NavLink({ item, collapsed = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = isNavItemActive(item, pathname)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
        'text-muted-foreground hover:text-foreground hover:bg-muted/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'bg-primary/10 text-primary font-medium shadow-sm',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        className={cn(
          'w-5 h-5 flex-shrink-0 transition-colors duration-200',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-xupay-primary text-white">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}
