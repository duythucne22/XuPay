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
      className="flex items-center justify-between py-3 border-b border-[var(--xupay-border-light)] last:border-b-0"
    >
      <span className="text-sm text-[var(--xupay-text-secondary)]">
        {label}
      </span>
      <span className={`font-medium ${isMuted ? 'text-[var(--xupay-text-muted)]' : 'text-[var(--xupay-text-primary)]'}`}>
        {value}
      </span>
    </motion.div>
  )
}
