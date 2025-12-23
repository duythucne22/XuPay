'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Container } from '@/components/layout/Container'
import { useAnalyticsOverview } from '@/hooks/api/useAnalytics'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from 'lucide-react'

/**
 * PHASE 1 PR 6: Analytics Page
 * 
 * Route: /app/analytics
 * Layout: Dashboard
 * Grid: KPI (4 cols desktop) + Charts (2 cols desktop)
 * Data: useAnalyticsOverview()
 */

type AnalyticsPeriod = 'week' | 'month' | 'year'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('month')
  const { data, isLoading, error } = useAnalyticsOverview(period)

  if (error) {
    return (
      <DashboardLayout>
        <Container>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-600">Failed to load analytics</h2>
              <p className="text-gray-600 mt-2">{error.message}</p>
            </div>
          </div>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Container maxWidth size="lg">
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Platform performance metrics and insights
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* KPI Cards Grid: desktop 4 → tablet 2 → mobile 1 (DESKTOP-FIRST) */}
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-grid-default">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))
              : data?.kpis.map((kpi) => (
                  <div key={kpi.id} className="card-base">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {kpi.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                          {kpi.value}
                        </p>
                      </div>
                      <div className={`text-sm font-semibold ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.change}
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Charts Grid: desktop 2 → mobile 1 (DESKTOP-FIRST) */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-grid-default">
            {/* User Growth Chart */}
            <div className="card-base">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                User Growth
              </h3>
              {isLoading ? (
                <Skeleton className="h-64 rounded-lg" />
              ) : (
                <div className="h-64 flex items-end gap-2">
                  {data?.userGrowth.map((item, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(item.value / 6000) * 100}%` }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction Volume Chart */}
            <div className="card-base">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                Transaction Volume
              </h3>
              {isLoading ? (
                <Skeleton className="h-64 rounded-lg" />
              ) : (
                <div className="h-64 flex items-end gap-2">
                  {data?.transactionVolume.map((item, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-secondary rounded-t"
                        style={{ height: `${(item.value / 150000) * 100}%` }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversion Rate Chart */}
          <div className="card-base">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Conversion Rate
            </h3>
            {isLoading ? (
              <Skeleton className="h-64 rounded-lg" />
            ) : (
              <div className="h-64 flex items-end gap-2">
                {data?.conversionRate.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-success rounded-t"
                      style={{ height: `${(item.value / 5) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </DashboardLayout>
  )
}
