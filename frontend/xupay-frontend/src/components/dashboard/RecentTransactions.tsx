'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react'
import { NeoCard } from '@/components/ui/NeoCard'
import { useTransactions } from '@/hooks/api/useTransactions.new'

interface Transaction {
  id: string
  transactionId?: string
  type: string
  amount?: string | number
  amountCents?: number
  status: string
  date?: string
  from?: string
  to?: string
}

interface RecentTransactionsProps {
  userId?: string
  limit?: number
  onTransactionClick?: (transactionId: string) => void
  transactions?: Transaction[]
}

export function RecentTransactions({ userId, limit = 5, onTransactionClick, transactions: propTransactions }: RecentTransactionsProps) {
  // If transactions are passed as prop, use them directly (for dashboard page)
  const shouldFetchTransactions = !propTransactions
  
  const { data, isLoading, isError } = shouldFetchTransactions 
    ? useTransactions({ userId, page: 1, size: limit }) as any
    : { data: null, isLoading: false, isError: false }

  // Use prop transactions if available, otherwise use fetched data
  const transactionItems = propTransactions || data?.items || []

  if (isLoading) {
    return (
      <NeoCard className="h-full flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
        </div>
        <div className="p-4">
          <div data-testid="recent-transactions-skeleton" className="space-y-2">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      </NeoCard>
    )
  }

  if (isError) {
    return (
      <NeoCard className="h-full flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
        </div>
        <div className="p-4">
          <div data-testid="recent-transactions-error">Error loading transactions</div>
        </div>
      </NeoCard>
    )
  }

  const items = transactionItems

  if (!items.length) {
    return (
      <NeoCard className="h-full flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
        </div>
        <div className="p-4">
          <div data-testid="recent-transactions-empty">No transactions yet</div>
        </div>
      </NeoCard>
    )
  }

  return (
    <NeoCard className="h-full flex flex-col">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          View All
        </button>
      </div>

      <div className="p-4 space-y-2" data-testid="recent-transactions">
        {items.slice(0, limit).map((tx: any) => {
          const txId = tx.id || tx.transactionId
          // Normalize amount: support string (formatted) or numeric amount
          const rawAmount = tx.amount
          const txAmount = typeof rawAmount === 'string'
            ? parseFloat(rawAmount.replace(/[^0-9.-]+/g, ''))
            : (typeof rawAmount === 'number' ? rawAmount : ((tx.amountCents ?? 0) / 100))
          const txType = tx.type
          
          return (
            <div 
              key={txId} 
              data-testid={`transaction-item-${txId}`}
              onClick={() => onTransactionClick?.(txId)}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Icon / Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                  txType === 'received' || txType === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-300'
                }`}>
                  {txType === 'received' || txType === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {tx.from || tx.to || txId}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date || tx.status}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-sm font-medium ${
                  txType === 'received' || txType === 'deposit' ? 'text-emerald-400' : 'text-white'
                }`}>
                  {(txType === 'received' || txType === 'deposit' ? '+' : '-')}${txAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 capitalize">{txType}</p>
              </div>
            </div>
          )
        })}
      </div>
    </NeoCard>
  )
}