'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy } from 'lucide-react'
import Link from 'next/link'
import { BalanceHistoryChart } from '@/components/dashboard/BalanceHistoryChart'
import { WalletSettingsForm } from '@/components/dashboard/WalletSettingsForm'
import type { Wallet } from '@/components/dashboard/WalletGrid'

interface WalletDetailPageProps {
  params: {
    id: string
  }
}

// Mock wallet data
const MOCK_WALLETS: Wallet[] = [
  {
    id: 'wal_main_001',
    name: 'Main Wallet',
    type: 'PERSONAL',
    balance: 15423.50,
    currency: 'USD',
    status: 'active',
    isDefault: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastTransaction: {
      date: '2024-12-22T09:15:00Z',
      amount: 500.00,
      description: 'Transfer from Apple Inc.',
    },
    transactionCount: 45,
  },
  {
    id: 'wal_savings_001',
    name: 'Savings Account',
    type: 'PERSONAL',
    balance: 8750.25,
    currency: 'USD',
    status: 'active',
    isDefault: false,
    createdAt: '2024-02-10T14:20:00Z',
    lastTransaction: {
      date: '2024-12-20T16:45:00Z',
      amount: 250.00,
      description: 'Monthly deposit',
    },
    transactionCount: 12,
  },
  {
    id: 'wal_business_001',
    name: 'Business Account',
    type: 'MERCHANT',
    balance: 25680.00,
    currency: 'USD',
    status: 'active',
    isDefault: false,
    createdAt: '2024-03-05T08:10:00Z',
    lastTransaction: {
      date: '2024-12-21T13:20:00Z',
      amount: 1200.00,
      description: 'Client payment received',
    },
    transactionCount: 78,
  },
  {
    id: 'wal_escrow_001',
    name: 'Escrow Wallet',
    type: 'ESCROW',
    balance: 5000.00,
    currency: 'USD',
    status: 'active',
    isDefault: false,
    createdAt: '2024-06-20T11:00:00Z',
    lastTransaction: {
      date: '2024-12-15T10:30:00Z',
      amount: 5000.00,
      description: 'Transaction held in escrow',
    },
    transactionCount: 2,
  },
]

// Mock balance history
const MOCK_BALANCE_HISTORY = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  balance: 15000 + Math.random() * 5000,
}))

export default function WalletDetailPage({ params }: WalletDetailPageProps) {
  const wallet = MOCK_WALLETS.find((w) => w.id === params.id)
  const [isLoading, setIsLoading] = useState(false)

  if (!wallet) {
    return (
      <div className="space-y-6">
        <Link href="/wallets">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wallets
          </motion.button>
        </Link>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Wallet not found</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      frozen: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    }
    return statusMap[status] || statusMap.active
  }

  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      PERSONAL: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      MERCHANT: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      ESCROW: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    }
    return typeMap[type] || typeMap.PERSONAL
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const handleCopyWalletId = () => {
    navigator.clipboard.writeText(wallet.id)
    alert('Wallet ID copied to clipboard!')
  }

  const handleSettingsSave = (changes: Partial<Wallet>) => {
    setIsLoading(true)
    // TODO: Backend Integration
    // When backend is ready, call:
    // const response = await fetch(`/api/wallets/${wallet.id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(changes),
    // })
    // const updated = await response.json()
    // Update wallet state with response
    console.log('Wallet settings to save:', changes)
    setTimeout(() => {
      setIsLoading(false)
      alert('Wallet settings save - Backend integration pending')
    }, 500)
  }

  const handleWalletDelete = () => {
    // TODO: Backend Integration
    // When backend is ready, call:
    // const response = await fetch(`/api/wallets/${wallet.id}`, {
    //   method: 'DELETE',
    // })
    // Redirect to wallets list if successful
    console.log('Wallet to delete:', wallet.id)
    alert('Wallet delete - Backend integration pending')
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/wallets">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg flex items-center gap-2 transition-colors"
          data-testid="wallet-detail-back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wallets
        </motion.button>
      </Link>

      {/* Wallet Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800 p-8"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {wallet.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Created {new Date(wallet.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full border ${getTypeColor(wallet.type)}`}
              >
                {wallet.type}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full border capitalize ${getStatusColor(
                  wallet.status
                )}`}
              >
                {wallet.status}
              </span>
              {wallet.isDefault && (
                <span className="text-sm font-medium px-3 py-1 rounded-full border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                  Default
                </span>
              )}
            </div>
          </div>

          {/* Balance */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Balance</p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(wallet.balance)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Balance History Chart */}
          <BalanceHistoryChart
            data={MOCK_BALANCE_HISTORY}
            walletName={wallet.name}
            currency={wallet.currency}
          />

          {/* Wallet ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Wallet Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Wallet ID
                </p>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {wallet.id}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyWalletId}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 flex-shrink-0"
                    data-testid="wallet-detail-copy-id"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {wallet.transactionCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Currency
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {wallet.currency}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Settings
            </h3>
            <WalletSettingsForm
              wallet={wallet}
              onSave={handleSettingsSave}
              onDelete={handleWalletDelete}
              isLoading={isLoading}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
