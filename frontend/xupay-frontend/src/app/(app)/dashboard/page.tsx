'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StaggerContainer, itemVariants } from '@/components/animations'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { WalletSelector } from '@/components/dashboard/WalletSelector'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export default function DashboardPage() {
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, Minh! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{currentDate}</p>
      </motion.div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 70% */}
        <div className="lg:col-span-2 space-y-8">
          {/* Wallet Card */}
          <StaggerContainer className="w-full">
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Wallet
              </h2>
              <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-[#e879f9] rounded-2xl p-8 text-white shadow-lg">
                <BalanceCard walletId="wal_main_001" title="Account Balance" />
              </div>
            </motion.div>
          </StaggerContainer>

          {/* Recent Transactions */}
          <StaggerContainer className="w-full">
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
                <Link href="/transactions">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                <RecentTransactions userId="user_123" />
              </div>
            </motion.div>
          </StaggerContainer>
        </div>

        {/* Right Column - 30% */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <StaggerContainer className="w-full">
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <QuickActions />
            </motion.div>
          </StaggerContainer>

          {/* Wallet Selector */}
          <StaggerContainer className="w-full">
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select Wallet
              </h2>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                <WalletSelector userId="user_123" />
              </div>
            </motion.div>
          </StaggerContainer>

          {/* Account Stats Card */}
          <StaggerContainer className="w-full">
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Wallets
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      3
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Cards
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      2
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      KYC Status
                    </span>
                    <span className="text-green-500 font-semibold">Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Daily Limit
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      $5,000
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerContainer>
        </div>
      </div>
    </div>
  )
}
