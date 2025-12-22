'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWalletBalance } from '@/hooks/api/useWallets.new'

interface BalanceCardProps {
  walletId: string
  title?: string
  onLoadingChange?: (isLoading: boolean) => void
}

export function BalanceCard({ walletId, title = 'Balance', onLoadingChange }: BalanceCardProps) {
  const { data: balance, isLoading, isError, error } = useWalletBalance(walletId)
  const [displayBalance, setDisplayBalance] = useState(0)

  // Notify parent of loading state
  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  // Number counter animation: animate from current to new balance
  useEffect(() => {
    if (!balance?.balanceCents) return

    const startValue = displayBalance
    const endValue = balance.balanceCents
    const duration = 1000 // 1 second animation
    const steps = 60

    let frame = 0
    const interval = setInterval(() => {
      frame++
      const progress = frame / steps
      const currentValue = Math.round(startValue + (endValue - startValue) * progress)
      setDisplayBalance(currentValue)

      if (frame >= steps) {
        clearInterval(interval)
        setDisplayBalance(endValue)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [balance?.balanceCents])

  const balanceInCurrency = (displayBalance / 100).toFixed(2)

  // Entrance animation: fade in + slide up
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  // Skeleton loading state
  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md"
        data-testid="balance-card-skeleton"
      >
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-24"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-32"></div>
            <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded animate-pulse w-20"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Error state
  if (isError) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800"
        data-testid="balance-card-error"
      >
        <p className="text-red-700 dark:text-red-400 font-semibold">Failed to load balance</p>
        <p className="text-red-600 dark:text-red-500 text-sm mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
      data-testid="balance-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-600 dark:text-gray-300 font-semibold text-sm">{title}</h3>
          {balance?.walletType && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{balance.walletType}</div>
          )}
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          className="w-8 h-8 bg-blue-500 rounded-full opacity-20"
        />
      </div>

      <div className="space-y-2">
        {/* Animated balance display with neon effect */}
        <motion.div
          className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono"
          data-testid="balance-amount"
        >
          ${balanceInCurrency}
        </motion.div>

        {/* Wallet info */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Wallet ID: <span className="font-mono">{walletId.slice(0, 8)}...</span>
        </p>

        {/* Wallet status */}
        {balance && (
          <div className="pt-2 mt-2 border-t border-blue-200 dark:border-slate-600">
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Status:{' '}
              <span
                className={`font-semibold ${
                  balance.isFrozen
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                {balance.isFrozen ? 'Frozen' : 'Active'}
              </span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BalanceCard
