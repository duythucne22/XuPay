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
      <div className={`p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/6 animate-pulse ${className}`} aria-hidden>
        <div className="h-8 w-8 rounded-lg bg-white/6 mb-4" />
        <div className="h-6 w-3/4 bg-white/6 mb-2" />
        <div className="h-4 w-full bg-white/6" />
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col justify-between text-left w-full p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/6 hover:border-[var(--color-primary)]/30 transition-all shadow-sm hover:shadow-lg ${className}`}
      aria-label={`Open ${title}`}
    >
      <div className="flex items-center mb-3">
        <div className="bg-[rgba(var(--color-primary-rgb),0.08)] p-3 rounded-xl mr-4 flex items-center justify-center text-[var(--color-primary)]">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
    </motion.button>
  )
}
