'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Download, AlertCircle, Trash2 } from 'lucide-react'
import { BalanceHistoryChart } from './BalanceHistoryChart'
import { WalletSettingsForm } from './WalletSettingsForm'
import { RecentTransactions } from './RecentTransactions'
import type { Wallet } from './WalletGrid'

interface BalanceHistoryPoint {
  date: string
  balance: number
}

interface WalletDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  wallet: Wallet | null
  balanceHistory?: BalanceHistoryPoint[]
  onSettingsSave?: (walletId: string, changes: Partial<Wallet>) => void
  onWalletDelete?: (walletId: string) => void
  isLoading?: boolean
}

export function WalletDetailDrawer({
  isOpen,
  onClose,
  wallet,
  balanceHistory = [],
  onSettingsSave,
  onWalletDelete,
  isLoading = false,
}: WalletDetailDrawerProps) {
  if (!wallet) return null

  const handleCopyWalletId = () => {
    navigator.clipboard.writeText(wallet.id)
    alert('Wallet ID copied to clipboard!')
  }

  const handleExportStatements = () => {
    // TODO: Backend Integration
    // When backend is ready, call:
    // const response = await fetch(`/api/wallets/${wallet.id}/statements/export`)
    // const blob = await response.blob()
    // const url = window.URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = `wallet-statements-${wallet.id}.pdf`
    // a.click()
    alert('Export Statements - Backend integration pending')
  }

  const handleFreezeToggle = () => {
    if (onSettingsSave) {
      onSettingsSave(wallet.id, {
        status: wallet.status === 'frozen' ? 'active' : 'frozen',
      })
    }
  }

  const handleDelete = () => {
    if (onWalletDelete) {
      onWalletDelete(wallet.id)
    }
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
      currency: wallet?.currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
            data-testid="wallet-detail-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-xl z-50 overflow-y-auto"
            data-testid={`wallet-detail-drawer-${wallet.id}`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {wallet.name}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
                data-testid="wallet-drawer-close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Wallet Info Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800 p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Balance</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {formatCurrency(wallet.balance)}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${getTypeColor(wallet.type)}`}
                  >
                    {wallet.type}
                  </span>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${getStatusColor(
                      wallet.status
                    )}`}
                  >
                    {wallet.status}
                  </span>
                  {wallet.isDefault && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {wallet.transactionCount}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Created
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {new Date(wallet.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Balance History Chart */}
              {balanceHistory.length > 0 && (
                <BalanceHistoryChart
                  data={balanceHistory}
                  walletName={wallet.name}
                  currency={wallet.currency}
                />
              )}

              {/* Wallet ID Info */}
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Wallet ID
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {wallet.id.substring(0, 12)}...
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyWalletId}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
                    data-testid="wallet-copy-id"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Wallet Settings Form */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Settings
                </h3>
                <WalletSettingsForm
                  wallet={wallet}
                  onSave={(changes) =>
                    onSettingsSave?.(wallet.id, changes)
                  }
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportStatements}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  data-testid="wallet-export-statements"
                >
                  <Download className="w-4 h-4" />
                  Export Statements
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFreezeToggle}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${
                    wallet.status === 'frozen'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                  data-testid="wallet-freeze-toggle-btn"
                >
                  {wallet.status === 'frozen' ? 'Unfreeze Wallet' : 'Freeze Wallet'}
                </motion.button>
              </div>

              {/* Backend Integration Notes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                data-testid="wallet-backend-notes"
              >
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium mb-2">Backend Integration Pending:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Export Statements PDF generation</li>
                      <li>Wallet settings persistence to backend</li>
                      <li>Delete wallet confirmation with backend</li>
                      <li>Real-time balance updates</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default WalletDetailDrawer
