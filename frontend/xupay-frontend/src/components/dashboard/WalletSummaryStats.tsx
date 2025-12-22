'use client'

import { motion } from 'framer-motion'
import { DollarSign, Wallet, TrendingUp, Activity } from 'lucide-react'
import { StaggerContainer, itemVariants } from '@/components/animations'

interface WalletSummaryStatsProps {
  totalBalance: number
  activeWallets: number
  walletsWithBalance: number
  totalTransactions: number
  currency?: string
}

export function WalletSummaryStats({
  totalBalance,
  activeWallets,
  walletsWithBalance,
  totalTransactions,
  currency = 'USD',
}: WalletSummaryStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const stats = [
    {
      label: 'Total Balance',
      value: formatCurrency(totalBalance),
      icon: DollarSign,
      color: 'blue',
      trend: '+8.5%',
    },
    {
      label: 'Active Wallets',
      value: activeWallets.toString(),
      icon: Wallet,
      color: 'green',
    },
    {
      label: 'Wallets with Balance',
      value: walletsWithBalance.toString(),
      icon: TrendingUp,
      color: 'purple',
    },
    {
      label: 'Total Transactions',
      value: totalTransactions.toString(),
      icon: Activity,
      color: 'amber',
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800',
      green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800',
      purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800',
      amber: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800',
    }
    return colorMap[color] || colorMap.blue
  }

  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      amber: 'text-amber-600 dark:text-amber-400',
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <StaggerContainer className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
            >
              <div
                className={`bg-gradient-to-br ${getColorClasses(
                  stat.color
                )} border rounded-lg p-6 transition-all hover:shadow-lg`}
                data-testid={`wallet-summary-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-white dark:bg-slate-900 ${getIconColor(
                      stat.color
                    )}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </StaggerContainer>
  )
}

export default WalletSummaryStats
