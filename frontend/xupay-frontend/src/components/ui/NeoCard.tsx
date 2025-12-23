import React from 'react'
import { motion } from 'framer-motion'

interface NeoCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NeoCard({ children, className = '', onClick }: NeoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        backdrop-blur-md
        shadow-xl
        hover:border-emerald-500/30 hover:shadow-emerald-500/10 hover:shadow-lg
        transition-all duration-300
        ${className}
      `}
      style={{ backgroundColor: 'rgba(var(--color-bg-secondary-rgb), 0.6)', borderColor: 'rgba(var(--color-text-primary-rgb), 0.05)' }}
    >
      {/* Subtle Gradient Noise Texture (Optional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}