'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'

/**
 * PHASE 1 PR 6: Analytics Hooks
 * 
 * For new Analytics page (/app/analytics)
 */

export interface AnalyticsKPI {
  id: string
  label: string
  value: number | string
  change?: string
  trend?: 'up' | 'down'
  format?: 'currency' | 'number' | 'percentage'
}

export interface AnalyticsChartData {
  label: string
  value: number
}

export interface AnalyticsData {
  kpis: AnalyticsKPI[]
  userGrowth: AnalyticsChartData[]
  transactionVolume: AnalyticsChartData[]
  conversionRate: AnalyticsChartData[]
}

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  period: (period: string) => [...analyticsKeys.all, 'period', period] as const,
}

/**
 * Fetch analytics overview data
 */
export function useAnalyticsOverview(
  period: 'week' | 'month' | 'year' = 'month'
): UseQueryResult<AnalyticsData, Error> {
  return useQuery({
    queryKey: analyticsKeys.period(period),
    queryFn: async () => {
      // Mock data for analytics
      const kpis: AnalyticsKPI[] = [
        {
          id: '1',
          label: 'Total Users',
          value: '12,543',
          change: '+8.2%',
          trend: 'up',
        },
        {
          id: '2',
          label: 'Total Transactions',
          value: '45,231',
          change: '+12.5%',
          trend: 'up',
        },
        {
          id: '3',
          label: 'Transaction Volume',
          value: '$2.5M',
          change: '+5.3%',
          trend: 'up',
          format: 'currency',
        },
        {
          id: '4',
          label: 'Conversion Rate',
          value: '3.2%',
          change: '+0.5%',
          trend: 'up',
          format: 'percentage',
        },
      ]

      // Mock chart data
      const userGrowth = Array.from({ length: period === 'week' ? 7 : period === 'month' ? 30 : 12 }, (_, i) => ({
        label: period === 'week' ? `Day ${i + 1}` : period === 'month' ? `${i + 1}` : `Month ${i + 1}`,
        value: Math.floor(Math.random() * 5000 + 1000),
      }))

      const transactionVolume = Array.from({ length: period === 'week' ? 7 : period === 'month' ? 30 : 12 }, (_, i) => ({
        label: period === 'week' ? `Day ${i + 1}` : period === 'month' ? `${i + 1}` : `Month ${i + 1}`,
        value: Math.floor(Math.random() * 100000 + 50000),
      }))

      const conversionRate = Array.from({ length: period === 'week' ? 7 : period === 'month' ? 30 : 12 }, (_, i) => ({
        label: period === 'week' ? `Day ${i + 1}` : period === 'month' ? `${i + 1}` : `Month ${i + 1}`,
        value: Math.random() * 5 + 2,
      }))

      return {
        kpis,
        userGrowth,
        transactionVolume,
        conversionRate,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
