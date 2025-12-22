'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserWallet } from '@/hooks/api/useWallets.new'

interface WalletSelectorProps {
  userId: string
  onWalletSelect?: (walletId: string) => void
  selectedWalletId?: string
}

export function WalletSelector({ userId, onWalletSelect, selectedWalletId }: WalletSelectorProps) {
  const { data: wallet, isLoading, isError } = useUserWallet(userId)
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="bg-gray-200 dark:bg-slate-700 rounded-lg p-3 h-12 animate-pulse" data-testid="wallet-selector-skeleton" />
    )
  }

  if (isError || !wallet) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-red-600 text-sm" data-testid="wallet-selector-error">
        Failed to load wallet
      </div>
    )
  }

  const handleSelect = () => {
    onWalletSelect?.(wallet.walletId)
    setIsOpen(false)
  }

  const displayText = `${wallet.currency || 'N/A'} • $${(wallet.balanceCents / 100).toFixed(2)}`
  const isSelected = selectedWalletId === wallet.walletId

  return (
    <div className="relative" data-testid="wallet-selector">
      {/* Hover effect: neon glow */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
        className={`w-full px-4 py-3 rounded-lg border-2 text-left font-semibold transition-colors ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'
        }`}
        data-testid="wallet-selector-button"
      >
        <div className="flex items-center justify-between">
          <span>{displayText}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-blue-500"
          >
            ▼
          </motion.span>
        </div>
      </motion.button>

      {/* Dropdown with entrance animation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-slate-700"
          data-testid="wallet-selector-dropdown"
        >
          <button
            onClick={handleSelect}
            className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
            }`}
            data-testid="wallet-option"
          >
            <div className="font-semibold">{wallet.currency || 'Wallet'}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Balance: ${(wallet.balanceCents / 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              ID: {wallet.walletId.slice(0, 12)}...
            </div>
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default WalletSelector
