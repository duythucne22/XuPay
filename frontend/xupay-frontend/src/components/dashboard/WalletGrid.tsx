'use client'

import { motion } from 'framer-motion'
import { StaggerContainer, itemVariants } from '@/components/animations'
import { BalanceCard } from './BalanceCard'
import { Send, Plus, ArrowDownLeft } from 'lucide-react'

export interface Wallet {
  id: string
  name: string
  type: 'PERSONAL' | 'MERCHANT' | 'ESCROW'
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'inactive'
  createdAt: string
  lastTransaction?: {
    date: string
    amount: number
    description: string
  }
  transactionCount: number
  isDefault: boolean
}

interface WalletGridProps {
  wallets: Wallet[]
  onWalletClick: (wallet: Wallet) => void
  onSendClick?: (wallet: Wallet) => void
  onAddFundsClick?: (wallet: Wallet) => void
  isLoading?: boolean
}

// Map wallet types to icons and colors
const WALLET_TYPE_INFO = {
  PERSONAL: {
    icon: '👤',
    label: 'Personal',
    color: 'from-blue-500 to-cyan-500',
    accentColor: 'text-cyan-400',
    borderColor: 'rgba(34, 211, 238, 0.2)',
  },
  MERCHANT: {
    icon: '💼',
    label: 'Business',
    color: 'from-purple-500 to-pink-500',
    accentColor: 'text-purple-400',
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  ESCROW: {
    icon: '🔒',
    label: 'Escrow',
    color: 'from-amber-500 to-orange-500',
    accentColor: 'text-amber-400',
    borderColor: 'rgba(251, 146, 60, 0.2)',
  },
}

export function WalletGrid({
  wallets,
  onWalletClick,
  onSendClick,
  onAddFundsClick,
  isLoading = false,
}: WalletGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-slate-700 rounded-lg h-56 animate-pulse"
            data-testid="wallet-grid-skeleton"
          />
        ))}
      </div>
    )
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No wallets found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      frozen: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    }
    return statusColors[status] || statusColors.inactive
  }

  return (
    <StaggerContainer className="w-full">
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
        {wallets.map((wallet) => {
          const typeInfo = WALLET_TYPE_INFO[wallet.type]
          const isDisabled = wallet.status !== 'active'

          return (
            <motion.div
              key={wallet.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => onWalletClick(wallet)}
              className="cursor-pointer group"
              data-testid={`wallet-card-${wallet.id}`}
            >
              {/* Glass morphism card with neon glow */}
              <div className="relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl">
                {/* Gradient background with glass effect */}
                <div
                  className="absolute inset-0 backdrop-blur-xl"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${typeInfo.borderColor}`,
                  }}
                />

                {/* Holographic shimmer overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1))`,
                  }}
                />

                {/* Neon glow on hover */}
                <div
                  className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(168, 85, 247, 0.2))`,
                  }}
                />

                {/* Content */}
                <div className="relative p-6 h-full flex flex-col justify-between">
                  {/* Header with Type Icon and Status */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{typeInfo.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {wallet.name}
                          </h3>
                          <p className={`text-xs font-medium ${typeInfo.accentColor}`}>
                            {typeInfo.label}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${getStatusColor(
                          wallet.status
                        )}`}
                      >
                        {wallet.status}
                      </span>
                    </div>

                    {/* Default Badge */}
                    {wallet.isDefault && (
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block">
                        ★ Default
                      </div>
                    )}
                  </div>

                  {/* Balance Display */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Current Balance</p>
                    <p className="text-3xl font-bold text-white">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: wallet.currency,
                      }).format(wallet.balance)}
                    </p>
                  </div>

                  {/* Last Transaction or Empty State */}
                  {wallet.lastTransaction ? (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Last Transaction</p>
                      <p className="text-sm font-medium text-white truncate">
                        {wallet.lastTransaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(wallet.lastTransaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-gray-400">No transactions yet</p>
                    </div>
                  )}

                  {/* Transaction Count */}
                  <p className="text-xs text-gray-400 mb-4">
                    <span className="font-semibold text-white">{wallet.transactionCount}</span>{' '}
                    transactions
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSendClick?.(wallet)
                      }}
                      disabled={isDisabled}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-all ${
                        isDisabled
                          ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                          : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30'
                      }`}
                      data-testid={`wallet-send-${wallet.id}`}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddFundsClick?.(wallet)
                      }}
                      disabled={isDisabled}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-all ${
                        isDisabled
                          ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30'
                      }`}
                      data-testid={`wallet-add-funds-${wallet.id}`}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onWalletClick(wallet)
                      }}
                      className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                      data-testid={`wallet-details-${wallet.id}`}
                    >
                      <ArrowDownLeft className="w-4 h-4 rotate-180" />
                      Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </StaggerContainer>
  )
}

export default WalletGrid
