'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { WalletSummaryStats } from '@/components/dashboard/WalletSummaryStats'
import { WalletGrid, type Wallet } from '@/components/dashboard/WalletGrid'
import { WalletDetailDrawer } from '@/components/dashboard/WalletDetailDrawer'
import { PaginationControls } from '@/components/common/PaginationControls'

// Mock wallet data - replace with API calls when backend is ready
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
  {
    id: 'wal_frozen_001',
    name: 'Frozen Account',
    type: 'PERSONAL',
    balance: 0.00,
    currency: 'USD',
    status: 'frozen',
    isDefault: false,
    createdAt: '2024-04-12T09:00:00Z',
    transactionCount: 5,
  },
  {
    id: 'wal_credit_001',
    name: 'Credit Line',
    type: 'PERSONAL',
    balance: -2500.00,
    currency: 'USD',
    status: 'active',
    isDefault: false,
    createdAt: '2024-07-01T12:00:00Z',
    lastTransaction: {
      date: '2024-12-22T15:00:00Z',
      amount: 100.00,
      description: 'Payment received',
    },
    transactionCount: 23,
  },
  {
    id: 'wal_investment_001',
    name: 'Investment Account',
    type: 'PERSONAL',
    balance: 42300.75,
    currency: 'USD',
    status: 'active',
    isDefault: false,
    createdAt: '2024-05-15T16:30:00Z',
    lastTransaction: {
      date: '2024-12-19T14:10:00Z',
      amount: 5000.00,
      description: 'Monthly investment',
    },
    transactionCount: 8,
  },
  {
    id: 'wal_reserve_001',
    name: 'Reserve Fund',
    type: 'PERSONAL',
    balance: 12150.00,
    currency: 'USD',
    status: 'active',
    isDefault: false,
    createdAt: '2024-08-22T10:15:00Z',
    lastTransaction: {
      date: '2024-12-10T11:20:00Z',
      amount: 1000.00,
      description: 'Contribution to reserve',
    },
    transactionCount: 15,
  },
]

// Mock balance history - replace with API calls when backend is ready
const MOCK_BALANCE_HISTORY = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  balance: 15000 + Math.random() * 5000,
}))

export default function WalletsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Debounce search query (300ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Filter wallets
  const filteredWallets = useMemo(() => {
    return MOCK_WALLETS.filter((wallet) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase()
        if (
          !wallet.name.toLowerCase().includes(query) &&
          !wallet.id.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Type filter
      if (typeFilter !== 'all' && wallet.type !== typeFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== 'all' && wallet.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [debouncedSearchQuery, typeFilter, statusFilter])

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    return {
      totalBalance: MOCK_WALLETS.reduce((sum, w) => sum + w.balance, 0),
      activeWallets: MOCK_WALLETS.filter((w) => w.status === 'active').length,
      walletsWithBalance: MOCK_WALLETS.filter((w) => w.balance > 0).length,
      totalTransactions: MOCK_WALLETS.reduce((sum, w) => sum + w.transactionCount, 0),
    }
  }, [])

  // Pagination
  const totalPages = Math.ceil(filteredWallets.length / pageSize)
  const paginatedWallets = filteredWallets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleWalletClick = (wallet: Wallet) => {
    setSelectedWallet(wallet)
    setIsDrawerOpen(true)
  }

  const handleSendClick = (wallet: Wallet) => {
    // TODO: Backend Integration
    // Navigate to transfer page with wallet pre-selected
    console.log('Send from wallet:', wallet.id)
    alert('Send - Backend integration pending')
  }

  const handleAddFundsClick = (wallet: Wallet) => {
    // TODO: Backend Integration
    // Open add funds modal for selected wallet
    console.log('Add funds to wallet:', wallet.id)
    alert('Add funds - Backend integration pending')
  }

  const handleSettingsSave = (walletId: string, changes: Partial<Wallet>) => {
    // TODO: Backend Integration
    // When backend is ready, call:
    // const response = await fetch(`/api/wallets/${walletId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(changes),
    // })
    // const updated = await response.json()
    // Update wallet state with response
    console.log('Wallet settings to save:', walletId, changes)
    alert('Wallet settings save - Backend integration pending')
  }

  const handleWalletDelete = (walletId: string) => {
    // TODO: Backend Integration
    // When backend is ready, call:
    // const response = await fetch(`/api/wallets/${walletId}`, {
    //   method: 'DELETE',
    // })
    // Remove wallet from list if successful
    console.log('Wallet to delete:', walletId)
    alert('Wallet delete - Backend integration pending')
  }


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Your Wallets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and track all your wallets in one place
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-lg"
          data-testid="add-wallet-button"
        >
          <Plus className="w-5 h-5" />
          Add Wallet
        </motion.button>
      </motion.div>

      {/* Summary Stats */}
      <WalletSummaryStats
        totalBalance={summaryStats.totalBalance}
        activeWallets={summaryStats.activeWallets}
        walletsWithBalance={summaryStats.walletsWithBalance}
        totalTransactions={summaryStats.totalTransactions}
        currency="USD"
      />

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or wallet ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm"
            data-testid="wallet-search-input"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wallet Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {['all', 'PERSONAL', 'MERCHANT', 'ESCROW'].map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTypeFilter(type)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  typeFilter === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
                data-testid={`type-filter-${type}`}
              >
                {type === 'all' ? 'All Types' : type}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'frozen', 'inactive'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStatusFilter(status)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
                data-testid={`status-filter-${status}`}
              >
                {status === 'all' ? 'All Status' : status}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Info */}
      {filteredWallets.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredWallets.length)} of{' '}
          {filteredWallets.length} wallets
        </motion.p>
      )}

      {/* Wallet Grid */}
      <WalletGrid
        wallets={paginatedWallets}
        onWalletClick={handleWalletClick}
        onSendClick={handleSendClick}
        onAddFundsClick={handleAddFundsClick}
        isLoading={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      )}

      {/* Empty State */}
      {filteredWallets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No wallets match your filters
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setTypeFilter('all')
              setStatusFilter('all')
              setCurrentPage(1)
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset filters
          </button>
        </motion.div>
      )}

      {/* Wallet Detail Drawer */}
      <WalletDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        wallet={selectedWallet}
        balanceHistory={MOCK_BALANCE_HISTORY}
        onSettingsSave={handleSettingsSave}
        onWalletDelete={handleWalletDelete}
        isLoading={false}
      />
    </div>
  )
}
