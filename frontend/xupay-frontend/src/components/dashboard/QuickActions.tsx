'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface QuickActionsProps {
  onSendClick?: () => void
  onRequestClick?: () => void
  onHistoryClick?: () => void
  onSettingsClick?: () => void
}

export function QuickActions({
  onSendClick,
  onRequestClick,
  onHistoryClick,
  onSettingsClick,
}: QuickActionsProps) {
  const router = useRouter()

  // Hover effect: neon glow + lift
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -4,
      transition: { duration: 0.2 },
    },
  }

  const actions = [
    {
      id: 'send',
      label: 'Send',
      icon: '→',
      color: 'from-blue-500 to-blue-600',
      onClick: onSendClick || (() => router.push('/transfer')),
    },
    {
      id: 'request',
      label: 'Request',
      icon: '←',
      color: 'from-green-500 to-green-600',
      onClick: onRequestClick || (() => router.push('/request')),
    },
    {
      id: 'history',
      label: 'History',
      icon: '📋',
      color: 'from-purple-500 to-purple-600',
      onClick: onHistoryClick || (() => router.push('/transactions')),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      color: 'from-amber-500 to-amber-600',
      onClick: onSettingsClick || (() => router.push('/settings')),
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      data-testid="quick-actions"
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          custom={index}
          variants={buttonVariants}
          whileHover="hover"
          onClick={action.onClick}
          className={`bg-gradient-to-br ${action.color} rounded-lg p-4 text-white font-semibold shadow-md hover:shadow-xl transition-shadow group`}
          data-testid={`action-${action.id}`}
        >
          {/* Neon glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.2)`,
            }}
          />

          <div className="relative flex flex-col items-center gap-2">
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm">{action.label}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}

export default QuickActions
