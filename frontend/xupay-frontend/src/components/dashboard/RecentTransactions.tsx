'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTransactions } from '@/hooks/api/useTransactions.new'
import type { TransactionDetailResponse } from '@/lib/paymentServiceClient'

interface RecentTransactionsProps {
  userId: string
  limit?: number
  onTransactionClick?: (transactionId: string) => void
}

export function RecentTransactions({
  userId,
  limit = 5,
  onTransactionClick,
}: RecentTransactionsProps) {
  const { data: transactions, isLoading, isError } = useTransactions({ userId })

  // Stagger animation: cascade effect for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  }

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md"
        data-testid="recent-transactions-skeleton"
      >
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (isError || !transactions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800"
        data-testid="recent-transactions-error"
      >
        <p className="text-red-700 dark:text-red-400 font-semibold">Failed to load transactions</p>
      </motion.div>
    )
  }

  const recentTx = (transactions?.items || []).slice(0, limit)

  if (recentTx.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md text-center"
        data-testid="recent-transactions-empty"
      >
        <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md"
      data-testid="recent-transactions"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>

      <div className="space-y-2">
        {recentTx.map((tx) => (
          <motion.button
            key={tx.transactionId}
            variants={itemVariants}
            whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
            onClick={() => onTransactionClick?.(tx.transactionId)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left"
            data-testid={`transaction-item-${tx.transactionId}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {/* Direction indicator */}
                {(() => {
                  const lowerType = (tx.type || '').toLowerCase()
                  // consider explicit type tokens plus fallback to comparing parties
                  const isOutgoing =
                    lowerType.includes('debit') ||
                    lowerType.includes('send') ||
                    lowerType.includes('sent') ||
                    lowerType.includes('withdraw') ||
                    tx.fromUserId === userId

                  return (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-lg font-bold ${isOutgoing ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}
                        >
                          {isOutgoing ? '→' : '←'}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {isOutgoing ? 'Sent' : 'Received'}
                        </span>
                      </div>

                      {/* Description / counterparty info */}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {tx.description ? tx.description : '—'}
                      </p>
                    </>
                  )
                })()}
              </div>

              <div className="text-right">
                {/* Amount */}
                {(() => {
                  const lowerType = (tx.type || '').toLowerCase()
                  const isOutgoing =
                    lowerType.includes('debit') ||
                    lowerType.includes('send') ||
                    lowerType.includes('sent') ||
                    lowerType.includes('withdraw') ||
                    tx.fromUserId === userId

                  return (
                    <p className={`text-sm font-bold ${isOutgoing ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {isOutgoing ? '-' : '+'}${(tx.amountCents / 100).toFixed(2)}
                    </p>
                  )
                })()}

                {/* Status badge */}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded mt-1 inline-block ${
                    tx.status === 'COMPLETED'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : tx.status === 'FAILED'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default RecentTransactions
