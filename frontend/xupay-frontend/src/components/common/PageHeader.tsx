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
        <h1 className="text-4xl font-bold text-[var(--xupay-text-primary)]">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--xupay-text-secondary)] mt-2">
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
