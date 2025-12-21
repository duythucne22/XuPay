'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { StatusBadgeProps } from '@/types'

const statusConfig = {
  completed: {
    bg: 'bg-[var(--xupay-success-light)]',
    text: 'text-[var(--xupay-success)]',
    border: 'border-[var(--xupay-success)]',
    label: 'Completed',
  },
  pending: {
    bg: 'bg-[var(--xupay-warning-light)]',
    text: 'text-[var(--xupay-warning)]',
    border: 'border-[var(--xupay-warning)]',
    label: 'Pending',
  },
  failed: {
    bg: 'bg-[var(--xupay-danger-light)]',
    text: 'text-[var(--xupay-danger)]',
    border: 'border-[var(--xupay-danger)]',
    label: 'Failed',
  },
  active: {
    bg: 'bg-[var(--xupay-success-light)]',
    text: 'text-[var(--xupay-success)]',
    border: 'border-[var(--xupay-success)]',
    label: 'Active',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-[var(--xupay-text-muted)]',
    border: 'border-[var(--xupay-text-muted)]',
    label: 'Inactive',
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export function StatusBadge({
  status,
  variant = 'solid',
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClass = sizeClasses[size]

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge 
        className={cn(
          'rounded-md font-medium',
          sizeClass,
          variant === 'solid' 
            ? `${config.bg} ${config.text}` 
            : `border ${config.border} ${config.text} bg-transparent`
        )}
      >
        {config.label}
      </Badge>
    </motion.div>
  )
}
