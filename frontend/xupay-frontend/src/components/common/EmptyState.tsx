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
      <h3 className="text-xl font-semibold text-[var(--xupay-text-primary)] mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[var(--xupay-text-muted)] mb-8 max-w-sm">
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
