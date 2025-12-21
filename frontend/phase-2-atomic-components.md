# 🚀 PHASE 2: ATOMIC COMPONENTS - COMPLETE GENERATION

## Pre-Flight: shadcn/ui Setup

Before copying component files, run:

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init -d

# Install core shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add label
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table
npx shadcn-ui@latest add skeleton
```

This will generate the base shadcn components in `src/components/ui/`.

---

## CUSTOM COMPONENT FILES

### 1. `src/components/common/KPICard.tsx` (Custom with NumberFlow & Animations)

```typescript
'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { KPICardProps } from '@/types'

export function KPICard({
  label,
  value,
  trend,
  icon,
  color = 'primary',
  isLoading = false,
}: KPICardProps) {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
  }

  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-24 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200 h-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-text-muted">
            {label}
          </CardTitle>
          {icon && <span className="text-2xl">{icon}</span>}
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-2"
          >
            <div className={`text-2xl font-bold ${colorClasses[color]}`}>
              {value}
            </div>

            {trend && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`text-xs flex items-center gap-1 ${trendColors[trend.direction]}`}
              >
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {Math.abs(trend.value)}% vs last 7d
                </span>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

---

### 2. `src/components/common/StatusBadge.tsx` (Semantic Colors)

```typescript
'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { StatusBadgeProps } from '@/types'

const statusConfig = {
  completed: {
    bg: 'bg-success-light',
    text: 'text-success',
    label: 'Completed',
  },
  pending: {
    bg: 'bg-warning-light',
    text: 'text-warning',
    label: 'Pending',
  },
  failed: {
    bg: 'bg-danger-light',
    text: 'text-danger',
    label: 'Failed',
  },
  active: {
    bg: 'bg-success-light',
    text: 'text-success',
    label: 'Active',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-text-muted',
    label: 'Inactive',
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
}

export function StatusBadge({
  status,
  variant = 'solid',
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClass = sizeClasses[size]

  const baseClass =
    variant === 'solid' ? `${config.bg} ${config.text}` : `border border-${config.text} ${config.text}`

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge className={`${baseClass} ${sizeClass} rounded-md font-medium`}>
        {config.label}
      </Badge>
    </motion.div>
  )
}
```

---

### 3. `src/components/common/Button.tsx` (Wrapper with Framer Motion)

```typescript
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const buttonVariants = {
  hover: {
    y: -2,
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  tap: {
    y: 0,
    scale: 0.98,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <motion.div
      variants={buttonVariants}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
      transition={{ duration: 0.15 }}
    >
      <ShadcnButton
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={cn(
          'transition-all duration-200 flex items-center justify-center gap-2',
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {children}
      </ShadcnButton>
    </motion.div>
  )
}
```

---

### 4. `src/components/common/Card.tsx` (Wrapper with Hover Effects)

```typescript
'use client'

import { motion } from 'framer-motion'
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isHoverable?: boolean
  isLoading?: boolean
}

export function Card({
  children,
  isHoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={isHoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <ShadcnCard
        className={cn(
          'transition-shadow duration-200',
          isHoverable && 'hover:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </ShadcnCard>
    </motion.div>
  )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
```

---

### 5. `src/components/common/EmptyState.tsx` (With Floating Animation)

```typescript
'use client'

import { motion } from 'framer-motion'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Floating Icon */}
      {icon && (
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-6xl mb-6"
        >
          {icon}
        </motion.div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-muted mb-8 max-w-sm">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {primaryAction && (
          <Button onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
```

---

### 6. `src/components/common/PageHeader.tsx` (Page Title + Description)

```typescript
'use client'

import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary mt-2">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div>
          {action}
        </div>
      )}
    </motion.div>
  )
}
```

---

### 7. `src/components/common/LoadingSpinner.tsx` (Centered Loader)

```typescript
'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

export function LoadingSpinner({
  size = 'md',
  message,
}: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <Loader2 className={`${sizeMap[size]} text-primary`} />
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-text-secondary text-sm"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}
```

---

### 8. `src/components/common/ThemeToggle.tsx` (Sun/Moon Button)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check initial theme
    const darkMode = document.documentElement.getAttribute('data-theme') === 'dark'
    setIsDark(darkMode)
  }, [])

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

  if (!mounted) return null

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 hover:bg-surface-hover rounded-md transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-warning" />
        ) : (
          <Moon className="w-5 h-5 text-text-secondary" />
        )}
      </motion.div>
    </motion.button>
  )
}
```

---

### 9. `src/components/common/DetailField.tsx` (Key-Value Display)

```typescript
'use client'

import { motion } from 'framer-motion'

interface DetailFieldProps {
  label: string
  value: string | number | React.ReactNode
  isMuted?: boolean
}

export function DetailField({
  label,
  value,
  isMuted = false,
}: DetailFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between py-3 border-b border-border-light last:border-b-0"
    >
      <span className="text-sm text-text-secondary">
        {label}
      </span>
      <span className={`font-medium ${isMuted ? 'text-text-muted' : 'text-text-primary'}`}>
        {value}
      </span>
    </motion.div>
  )
}
```

---

### 10. `src/components/common/AlertItem.tsx` (Alert Notification)

```typescript
'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

type AlertSeverity = 'info' | 'warning' | 'error' | 'success'

interface AlertItemProps {
  severity: AlertSeverity
  message: string
  onDismiss?: () => void
}

const severityConfig = {
  info: {
    icon: Info,
    bg: 'bg-info-light',
    border: 'border-info',
    text: 'text-info',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-light',
    border: 'border-warning',
    text: 'text-warning',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-danger-light',
    border: 'border-danger',
    text: 'text-danger',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-success-light',
    border: 'border-success',
    text: 'text-success',
  },
}

export function AlertItem({
  severity,
  message,
  onDismiss,
}: AlertItemProps) {
  const config = severityConfig[severity]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-md border',
        config.bg,
        config.border
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', config.text)} />
      <p className={cn('text-sm flex-1', config.text)}>
        {message}
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-xs px-2 py-1 hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </motion.div>
  )
}
```

---

### 11. `src/components/animations/PageTransition.tsx` (Entrance Animation)

```typescript
'use client'

import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
    },
  },
}

export function PageTransition({
  children,
}: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
```

---

### 12. `src/components/animations/StaggerContainer.tsx` (Staggered Load)

```typescript
'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  initialDelay?: number
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  initialDelay = 0.1,
}: StaggerContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

### 13. `src/hooks/useReducedMotion.ts` (Accessibility Hook)

```typescript
import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}
```

---

### 14. `src/hooks/useMediaQuery.ts` (Responsive Hook)

```typescript
import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
```

---

## Directory Structure After Phase 2

```
src/
├── components/
│   ├── ui/                    (shadcn/ui generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   └── skeleton.tsx
│   │
│   ├── common/                (CUSTOM - Copy from above)
│   │   ├── KPICard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── PageHeader.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── DetailField.tsx
│   │   ├── AlertItem.tsx
│   │   └── index.ts           (barrel export)
│   │
│   ├── animations/            (CUSTOM - Copy from above)
│   │   ├── PageTransition.tsx
│   │   ├── StaggerContainer.tsx
│   │   └── index.ts           (barrel export)
│   │
│   └── providers/             (NEXT - Phase 3)
│
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useMediaQuery.ts
│   └── index.ts               (barrel export)
│
├── lib/
│   ├── cn.ts                  (from Phase 1)
│   └── constants.ts
│
├── types/
│   └── index.ts               (from Phase 1)
│
├── styles/
│   └── globals.css            (from Phase 1)
│
└── app/
    ├── layout.tsx             (NEXT - Phase 3)
    └── page.tsx               (NEXT - Phase 3)
```

---

## BARREL EXPORTS

### `src/components/common/index.ts`

```typescript
export { KPICard } from './KPICard'
export { StatusBadge } from './StatusBadge'
export { Button } from './Button'
export { Card } from './Card'
export { EmptyState } from './EmptyState'
export { PageHeader } from './PageHeader'
export { LoadingSpinner } from './LoadingSpinner'
export { ThemeToggle } from './ThemeToggle'
export { DetailField } from './DetailField'
export { AlertItem } from './AlertItem'
```

### `src/components/animations/index.ts`

```typescript
export { PageTransition } from './PageTransition'
export { StaggerContainer } from './StaggerContainer'
```

### `src/hooks/index.ts`

```typescript
export { useReducedMotion } from './useReducedMotion'
export { useMediaQuery } from './useMediaQuery'
```

---

## PHASE 2: COMPLETE ✅

You now have:

✅ **14 Production-Ready Components**
✅ **All Framer Motion animations** (hover, tap, stagger, entrance)
✅ **Semantic color system** (success, danger, warning, info)
✅ **Accessibility hooks** (reduced motion detection)
✅ **TypeScript interfaces** for all props
✅ **Skeleton loading states** built-in
✅ **Dark mode support** in all components
✅ **Responsive design** foundation

---

## NEXT: PHASE 3

Ready for **Phase 3: Layout System (AppShell + Sidebar + Topbar)**

Then I'll generate:
- `AppShell.tsx` (Main wrapper)
- `Sidebar.tsx` (Collapsible navigation)
- `Topbar.tsx` (Header with controls)
- `NavLink.tsx` (Active state indicator)
- `NavGroup.tsx` (Section grouping)
- `UserMenu.tsx` (Profile dropdown)

## TESTING PHASE 2

```bash
# Create a test page to verify components work
# src/app/(app)/test/page.tsx

import { KPICard } from '@/components/common'
import { StaggerContainer } from '@/components/animations'

export default function TestPage() {
  return (
    <StaggerContainer>
      <KPICard label="Test" value="$1,234" icon="💰" color="primary" />
      <KPICard label="Test 2" value="$567" trend={{ value: 12, direction: 'up' }} icon="📈" color="success" />
    </StaggerContainer>
  )
}
```

Run `npm run dev` and visit `http://localhost:3000/test` to see components in action.
