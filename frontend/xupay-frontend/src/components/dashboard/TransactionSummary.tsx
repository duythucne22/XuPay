'use client'

import { motion } from 'framer-motion'
import { StaggerContainer, itemVariants } from '@/components/animations'
import { ArrowUpRight, ArrowDownLeft, CreditCard, HelpCircle } from 'lucide-react'

interface TransactionSummaryProps {
  totalSent: number
  totalReceived: number
  netFlow: number
  transactionCount: number
  failedCount: number
  currency?: string
}

export function TransactionSummary({
  totalSent,
  totalReceived,
  netFlow,
  transactionCount,
  failedCount,
  currency = 'USD',
}: TransactionSummaryProps) {
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
      label: 'Total Sent',
      value: formatCurrency(totalSent),
      trend: '-12.5%',
      icon: ArrowUpRight,
      color: 'red',
      isTrendNegative: true,
    },
    {
      label: 'Total Received',
      value: formatCurrency(totalReceived),
      trend: '+8.2%',
      icon: ArrowDownLeft,
      color: 'green',
      isTrendNegative: false,
    },
    {
      label: 'Net Flow',
      value: formatCurrency(netFlow),
      trend: '+25.7%',
      icon: CreditCard,
      color: 'blue',
      isTrendNegative: false,
    },
    {
      label: 'Transactions',
      value: `${transactionCount}`,
      subtitle: `${failedCount} failed`,
      icon: HelpCircle,
      color: 'purple',
    },
  ]

  return (
    <StaggerContainer className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorMap = {
            red: 'bg-red-500/10 text-red-500',
            green: 'bg-green-500/10 text-green-500',
            blue: 'bg-blue-500/10 text-blue-500',
            purple: 'bg-purple-500/10 text-purple-500',
          }

          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <div className={`p-2 rounded-lg ${colorMap[stat.color as keyof typeof colorMap]}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>

              {stat.subtitle && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              )}

              {stat.trend && (
                <div
                  className={`flex items-center mt-2 text-xs font-medium ${
                    stat.isTrendNegative ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {stat.isTrendNegative ? '↓' : '↑'} {stat.trend}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </StaggerContainer>
  )
}
