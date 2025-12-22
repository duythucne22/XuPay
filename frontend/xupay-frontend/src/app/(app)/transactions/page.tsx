'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Download,
  Copy,
  AlertCircle,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import { StaggerContainer } from '@/components/animations'
import { TransactionSummary } from '@/components/dashboard/TransactionSummary'
import { PaginationControls } from '@/components/common/PaginationControls'
import { useDebounce } from '@/hooks/useDebounce'

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: 'tx1',
    date: '02 Apr 2025',
    time: '8:15 am',
    description: 'Meta Quest 3',
    merchant: 'Meta Store',
    type: 'sent' as const,
    status: 'completed' as const,
    amount: -499.0,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Meta Inc.',
    fee: 2.5,
    transactionId: 'txn_1234567890',
    reference: 'ORDER#98765',
    method: 'Credit Card',
    balanceAfter: 15423.5,
  },
  {
    id: 'tx2',
    date: '06 Apr 2025',
    time: '6:45 pm',
    description: 'iPhone 15 Pro Max',
    merchant: 'Apple Store',
    type: 'sent' as const,
    status: 'completed' as const,
    amount: -1399.0,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Apple Inc.',
    fee: 6.99,
    transactionId: 'txn_0987654321',
    reference: 'ORDER#12345',
    method: 'Debit Card',
    balanceAfter: 13924.51,
  },
  {
    id: 'tx3',
    date: '10 Apr 2025',
    time: '11:30 am',
    description: 'MacBook Air M3',
    merchant: 'Best Buy',
    type: 'sent' as const,
    status: 'completed' as const,
    amount: -1299.0,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Best Buy Inc.',
    fee: 6.5,
    transactionId: 'txn_1122334455',
    reference: 'ORDER#54321',
    method: 'Apple Pay',
    balanceAfter: 12525.01,
  },
  {
    id: 'tx4',
    date: '14 Apr 2025',
    time: '7:50 pm',
    description: 'Salary Deposit',
    merchant: 'TechCorp Inc.',
    type: 'received' as const,
    status: 'completed' as const,
    amount: 8500.0,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'TechCorp Inc.',
    fee: 0,
    transactionId: 'txn_1357924680',
    reference: 'PAYROLL-APR25',
    method: 'ACH Transfer',
    balanceAfter: 17296.86,
  },
  {
    id: 'tx5',
    date: '18 Apr 2025',
    time: '9:05 am',
    description: 'Netflix Subscription',
    merchant: 'Netflix',
    type: 'fee' as const,
    status: 'completed' as const,
    amount: -15.99,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Netflix Inc.',
    fee: 0,
    transactionId: 'txn_2468013579',
    reference: 'BILL-NETFLIX-2025',
    method: 'Auto Debit',
    balanceAfter: 17280.87,
  },
  {
    id: 'tx6',
    date: '21 Apr 2025',
    time: '3:20 pm',
    description: 'Refund - Headphones',
    merchant: 'Amazon',
    type: 'refund' as const,
    status: 'completed' as const,
    amount: 89.99,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Amazon.com',
    fee: 0,
    transactionId: 'txn_9753108642',
    reference: 'REFUND-AMZ-7890',
    method: 'Credit Card',
    balanceAfter: 17370.86,
  },
  {
    id: 'tx7',
    date: '24 Apr 2025',
    time: '2:15 pm',
    description: 'Steam Purchase',
    merchant: 'Steam',
    type: 'sent' as const,
    status: 'pending' as const,
    amount: -49.99,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Valve Corporation',
    fee: 0.5,
    transactionId: 'txn_1928374650',
    reference: 'GAME-2025-STEAM',
    method: 'Credit Card',
    balanceAfter: 17320.37,
  },
  {
    id: 'tx8',
    date: '26 Apr 2025',
    time: '11:45 am',
    description: 'Hotel Booking',
    merchant: 'Booking.com',
    type: 'sent' as const,
    status: 'failed' as const,
    amount: -299.0,
    currency: 'USD',
    wallet: 'Main Wallet',
    counterparty: 'Booking.com B.V.',
    fee: 0,
    transactionId: 'txn_5748392019',
    reference: 'HOTEL-2025-NYC',
    method: 'Credit Card',
    balanceAfter: 17320.37,
  },
]

type TransactionType = 'sent' | 'received' | 'fee' | 'refund' | 'topup'
type TransactionStatus = 'completed' | 'pending' | 'failed'

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [walletFilter, setWalletFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof MOCK_TRANSACTIONS)[0] | null>(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        tx.counterparty.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        tx.transactionId.includes(debouncedSearchQuery)

      const matchesType = typeFilter === 'all' || tx.type === typeFilter
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
      const matchesWallet = walletFilter === 'all' || tx.wallet === walletFilter

      return matchesSearch && matchesType && matchesStatus && matchesWallet
    })
  }, [debouncedSearchQuery, typeFilter, statusFilter, walletFilter])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Calculate summary stats
  const summary = {
    totalSent: filteredTransactions
      .filter((tx) => tx.amount < 0 && tx.status === 'completed')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    totalReceived: filteredTransactions
      .filter((tx) => tx.amount > 0 && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
    netFlow: filteredTransactions
      .filter((tx) => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0),
    transactionCount: filteredTransactions.length,
    failedCount: filteredTransactions.filter((tx) => tx.status === 'failed').length,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount))
  }

  const getStatusBadge = (status: TransactionStatus) => {
    const statusMap = {
      completed: {
        label: 'Completed',
        className: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: <CheckCircle className="w-3 h-3" />,
      },
      pending: {
        label: 'Pending',
        className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: <Clock className="w-3 h-3" />,
      },
      failed: {
        label: 'Failed',
        className: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: <XCircle className="w-3 h-3" />,
      },
    }

    const data = statusMap[status]
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${data.className}`}>
        {data.icon}
        {data.label}
      </div>
    )
  }

  const getTypeIcon = (type: TransactionType, size = 16) => {
    const typeMap = {
      sent: { icon: <ArrowUpRight size={size} />, className: 'bg-red-500/10 text-red-500' },
      received: { icon: <ArrowDownLeft size={size} />, className: 'bg-green-500/10 text-green-500' },
      fee: { icon: <CreditCard size={size} />, className: 'bg-blue-500/10 text-blue-500' },
      refund: { icon: <RefreshCcw size={size} />, className: 'bg-purple-500/10 text-purple-500' },
      topup: { icon: <Banknote size={size} />, className: 'bg-yellow-500/10 text-yellow-500' },
    }

    const data = typeMap[type]
    return <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${data.className}`}>{data.icon}</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-gray-600 dark:text-gray-400">All activity across your wallets</p>
      </motion.div>

      {/* Summary Cards */}
      <TransactionSummary {...summary} />

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Date and Wallet Filters */}
        <div className="flex flex-row gap-4">
          <div className="relative flex-1">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          <div className="relative flex-1">
            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All wallets</option>
              <option value="Main Wallet">Main Wallet</option>
              <option value="Secondary">Secondary Wallet</option>
              <option value="Savings">Savings Wallet</option>
            </select>
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'sent', 'received', 'fee', 'refund'] as const).map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTypeFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                typeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'completed', 'pending', 'failed'] as const).map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, amount, reference..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Desktop Table View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="block"
      >
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 font-medium text-sm text-gray-600 dark:text-gray-400">
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Wallet</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            <StaggerContainer className="w-full">
              {paginatedTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => {
                    setSelectedTransaction(tx)
                    setIsDetailDrawerOpen(true)
                  }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900 dark:text-white">{tx.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.time}</p>
                  </div>

                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    {getTypeIcon(tx.type)}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{tx.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{tx.counterparty}</p>
                    </div>
                  </div> 

                  <div className="col-span-2 flex items-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                      {tx.wallet}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center justify-center">{getTypeIcon(tx.type)}</div>

                  <div className="col-span-2 text-right">
                    <p className={`font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                    {tx.fee > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+{formatCurrency(tx.fee)} fee</p>
                    )}
                  </div>

                  <div className="col-span-1 flex items-center">{getStatusBadge(tx.status)}</div>

                  <div className="col-span-1 flex items-center justify-end">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </motion.div>

      {/* Mobile Card View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden"
      >
        <StaggerContainer className="w-full">
          {paginatedTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedTransaction(tx)
                setIsDetailDrawerOpen(true)
              }}
              className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {getTypeIcon(tx.type, 20)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.counterparty}</p>
                  </div>
                </div>
                <div className={`text-right font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {tx.date} • {tx.time}
                </div>
                {getStatusBadge(tx.status)}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </motion.div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 25, 50]}
      />

      {/* Transaction Detail Drawer */}
      <AnimatePresence>
        {isDetailDrawerOpen && selectedTransaction && (
          <TransactionDetailDrawer
            transaction={selectedTransaction}
            isOpen={isDetailDrawerOpen}
            onClose={() => {
              setIsDetailDrawerOpen(false)
              setSelectedTransaction(null)
            }}
            getStatusBadge={getStatusBadge}
            getTypeIcon={getTypeIcon}
            formatCurrency={formatCurrency}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Transaction Detail Drawer Component
interface TransactionDetailDrawerProps {
  transaction: (typeof MOCK_TRANSACTIONS)[0]
  isOpen: boolean
  onClose: () => void
  getStatusBadge: (status: any) => React.ReactNode
  getTypeIcon: (type: any, size?: number) => React.ReactNode
  formatCurrency: (amount: number) => string
}

function TransactionDetailDrawer({
  transaction,
  isOpen,
  onClose,
  getStatusBadge,
  getTypeIcon,
  formatCurrency,
}: TransactionDetailDrawerProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 z-50 overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {transaction.date} • {transaction.time}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          {/* Amount Header */}
          <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-3">{getTypeIcon(transaction.type, 24)}</div>
            <p className={`text-3xl font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{transaction.description}</p>
            <div className="mt-3">{getStatusBadge(transaction.status)}</div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">From</p>
              <p className="font-medium text-gray-900 dark:text-white">{transaction.wallet}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.method}</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">To</p>
              <p className="font-medium text-gray-900 dark:text-white">{transaction.counterparty}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.merchant || 'External'}</p>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Transaction Information
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                <span className="font-mono text-gray-900 dark:text-white truncate max-w-[40%]">{transaction.transactionId}</span>
              </div>

              {transaction.reference && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reference</span>
                  <span className="font-mono text-gray-900 dark:text-white">{transaction.reference}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Method</span>
                <span className="text-gray-900 dark:text-white">{transaction.method}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="text-gray-900 dark:text-white font-medium">{transaction.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              {transaction.fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fee</span>
                  <span className="text-red-500">-{formatCurrency(transaction.fee)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Balance After</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(transaction.balanceAfter || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            {/* Copy Transaction ID */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyToClipboard(transaction.transactionId)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Transaction ID
            </motion.button>

            {/* Download Receipt - UI Ready, Backend Integration Comment */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // TODO: Backend Integration
                // When backend is ready, call:
                // const response = await fetch(`/api/transactions/${transaction.id}/receipt`)
                // const blob = await response.blob()
                // const url = window.URL.createObjectURL(blob)
                // const a = document.createElement('a')
                // a.href = url
                // a.download = `receipt-${transaction.transactionId}.pdf`
                // a.click()
                alert('Download Receipt - Backend integration pending')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </motion.button>

            {/* Report Issue - UI Ready, Backend Integration Comment */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // TODO: Backend Integration
                // When backend is ready, call:
                // POST /api/transactions/{id}/report
                // Body: { issue_type: string, description: string }
                // This will create an issue ticket in the support system
                alert('Report Issue - Backend integration pending')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Report Issue
            </motion.button>
          </div>

          {/* Backend Integration Notes */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
            <p className="font-medium">Backend Integration Pending:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Receipt Download: Requires PDF generation endpoint</li>
              <li>Issue Reporting: Requires issue tracking system backend</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  )
}
