'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertSeverity = 'info' | 'warning' | 'error' | 'success'

interface AlertItemProps {
  severity: AlertSeverity
  message: string
  onDismiss?: () => void
}

const severityConfig = {
  info: {
    icon: Info,
    bg: 'bg-[var(--xupay-info-light)]',
    border: 'border-[var(--xupay-info)]',
    text: 'text-[var(--xupay-info)]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[var(--xupay-warning-light)]',
    border: 'border-[var(--xupay-warning)]',
    text: 'text-[var(--xupay-warning)]',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-[var(--xupay-danger-light)]',
    border: 'border-[var(--xupay-danger)]',
    text: 'text-[var(--xupay-danger)]',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-[var(--xupay-success-light)]',
    border: 'border-[var(--xupay-success)]',
    text: 'text-[var(--xupay-success)]',
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
          className="p-1 hover:opacity-70 transition-opacity rounded"
          aria-label="Dismiss"
        >
          <X className={cn('w-4 h-4', config.text)} />
        </button>
      )}
    </motion.div>
  )
}
