'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  loading?: boolean
}

export default function FeatureCard({ title, description, icon, onClick, className = '', loading = false }: FeatureCardProps) {
  if (loading) {
    return (
      <div className={`p-6 rounded-2xl bg-[rgba(var(--color-primary-rgb),0.02)] backdrop-blur-sm border border-[rgba(var(--color-primary-rgb),0.04)] animate-pulse text-center max-w-[320px] mx-auto ${className}`} aria-hidden>
        <div className="h-8 w-8 rounded-lg bg-[rgba(var(--color-primary-rgb),0.04)] mb-4 mx-auto" />
        <div className="h-6 w-3/4 bg-[rgba(var(--color-primary-rgb),0.04)] mb-2 mx-auto" />
        <div className="h-4 w-full bg-[rgba(var(--color-primary-rgb),0.04)] mx-auto" />
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-between text-center w-full max-w-[320px] p-6 rounded-2xl bg-[rgba(var(--color-primary-rgb),0.03)] backdrop-blur-md border border-[rgba(var(--color-primary-rgb),0.06)] hover:border-[rgba(var(--color-primary-rgb),0.12)] transition-all shadow-sm hover:shadow-[0_10px_30px_rgba(var(--color-primary-rgb),0.08)] ${className}`}
      aria-label={`Open ${title}`}
    >
      <div className="flex items-center mb-3">
        <div className="bg-[rgba(var(--color-primary-rgb),0.08)] p-3 rounded-xl mr-4 flex items-center justify-center text-[var(--color-primary)]">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
    </motion.button>
  )
}
