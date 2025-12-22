'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { NeoCard } from '@/components/ui/NeoCard'

type ColorKey = 'blue' | 'green' | 'purple' | 'amber' | 'red'

interface StatCardProps {
  // Backwards-compatible props
  label?: string
  title?: string
  value: string
  unit?: string
  isLoading?: boolean
  color?: ColorKey
  onClick?: () => void
  icon?: React.ReactNode // accepts either a React node (tests) or component

  // Newer metric props (optional)
  change?: string
  trend?: 'up' | 'down'
  iconColor?: string
}

function colorToFromClass(color?: ColorKey) {
  switch (color) {
    case 'green': return 'from-green-50'
    case 'purple': return 'from-purple-50'
    case 'amber': return 'from-amber-50'
    case 'red': return 'from-red-50'
    default: return 'from-blue-50'
  }
}

export function StatCard({ label, title, value, unit, isLoading, color, onClick, icon, change, trend, iconColor = 'text-emerald-400' }: StatCardProps) {
  const isPositive = trend === 'up'

  // Loading skeleton for legacy tests
  if (isLoading) {
    return (
      <div data-testid="stat-card-skeleton" className="p-4 rounded-lg bg-white/5 w-full h-20" />
    )
  }

  return (
    <NeoCard className="p-4 group">
      <button
        data-testid="stat-card"
        disabled={!onClick}
        onClick={onClick}
        className={`w-full text-left flex items-center justify-between gap-4 px-4 py-3 rounded-lg ${colorToFromClass(color)} bg-gradient-to-br`}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Icon area */}
          <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${iconColor}`}>
            {icon ? (
              // If icon is a React node render it, otherwise it's a component
              (typeof icon === 'object' || typeof icon === 'string') ? icon : React.createElement(icon as any, { size: 24 })
            ) : (
              <div style={{ width: 24, height: 24 }} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-400">{label ?? title}</h3>
            <p className="text-2xl font-bold text-white tracking-tight">
              {value}{unit && <span className="text-sm ml-2 font-medium text-gray-400">{unit}</span>}
            </p>
          </div>
        </div>

        {/* Optional trend indicator for newer API */}
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{change}</span>
          </div>
        )}
      </button>
    </NeoCard>
  )
}