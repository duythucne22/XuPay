'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface BalanceHistoryPoint {
  date: string
  balance: number
}

interface BalanceHistoryChartProps {
  data: BalanceHistoryPoint[]
  walletName?: string
  currency?: string
}

export function BalanceHistoryChart({
  data,
  walletName = 'Wallet',
  currency = 'USD',
}: BalanceHistoryChartProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Prepare data for chart (last 30 days)
  const chartData = data.slice(-30)

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6" data-testid="balance-history-chart">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{walletName} — Balance History (30 days)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">No balance history available</p>
        </div>
      </div>
    )
  }

  // Find min/max for chart scaling
  const balances = chartData.map((d) => d.balance)
  const minBalance = Math.min(...balances)
  const maxBalance = Math.max(...balances)
  const avgBalance = (minBalance + maxBalance) / 2

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
      data-testid="balance-history-chart"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {walletName} — Balance History (30 days)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Average: {formatCurrency(avgBalance)}
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-slate-700"
            />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              className="dark:stroke-gray-500"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            />
            <YAxis
              stroke="#9ca3af"
              className="dark:stroke-gray-500"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : '$0'}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              labelStyle={{
                color: '#e2e8f0',
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={500}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Highest</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(maxBalance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(avgBalance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lowest</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(minBalance)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default BalanceHistoryChart
