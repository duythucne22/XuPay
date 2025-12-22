'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red'
  isLoading?: boolean
  onClick?: () => void
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800',
  green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800',
  purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800',
  amber: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800',
  red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border-red-200 dark:border-red-800',
}

const textColors = {
  blue: 'text-blue-700 dark:text-blue-400',
  green: 'text-green-700 dark:text-green-400',
  purple: 'text-purple-700 dark:text-purple-400',
  amber: 'text-amber-700 dark:text-amber-400',
  red: 'text-red-700 dark:text-red-400',
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  color = 'blue',
  isLoading = false,
  onClick,
}: StatCardProps) {
  // Entrance animation: fade in + slide up
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  // Hover effect: lift animation + subtle glow
  const hoverVariants = {
    hover: {
      y: -8,
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.2 },
    },
  }

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-5 border animate-pulse`}
        data-testid="stat-card-skeleton"
      >
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-20"></div>
          <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-24"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.button
      initial="hidden"
      animate="visible"
      whileHover={onClick ? 'hover' : undefined}
      variants={containerVariants}
      onClick={onClick}
      disabled={!onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-5 border text-left w-full transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
      }`}
      data-testid="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
            {label}
          </p>

          {/* Value with unit */}
          <div className="flex items-baseline gap-2">
            <motion.p
              className={`text-2xl font-bold ${textColors[color]}`}
              data-testid="stat-value"
            >
              {value}
            </motion.p>
            {unit && <p className="text-sm text-gray-600 dark:text-gray-400">{unit}</p>}
          </div>
        </div>

        {/* Icon placeholder */}
        {icon && (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'loop' }}
            className={`${textColors[color]} opacity-30`}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}

export default StatCard
