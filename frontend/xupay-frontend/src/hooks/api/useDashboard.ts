'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { MockUserServiceClient } from '@/lib/mockUserClient'

/**
 * PHASE 1 PR 6: Dashboard Overview Hook
 * 
 * Combines multiple data sources into a single dashboard view:
 * - KPI metrics (totals, stats)
 * - Chart data (balance history)
 * - Recent transactions
 * 
 * Used by: Dashboard page (/app/dashboard)
 */

export interface DashboardKPI {
  id: string
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down'
  icon?: React.ReactNode
  color?: string
}

export interface DashboardChartData {
  date: string
  balance: number
}

export interface DashboardTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export interface DashboardOverview {
  kpis: DashboardKPI[]
  chartData: DashboardChartData[]
  recentTransactions: DashboardTransaction[]
  loading: boolean
  error: string | null
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
}

/**
 * Fetch dashboard overview data
 * Combines data from multiple sources (users, wallets, transactions)
 */
export function useDashboardOverview(): UseQueryResult<
  Omit<DashboardOverview, 'loading' | 'error'>,
  Error
> {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: async () => {
      try {
        // For now, use mock data from MockUserServiceClient
        // In production, this would call dashboardApi.getOverview()
        const mockClient = new MockUserServiceClient()
        const profile = await mockClient.getMyProfile()
        
        // Mock KPI data
        const kpis: DashboardKPI[] = [
          {
            id: '1',
            title: 'Total Balance',
            value: '$32,126.00',
            change: '+15%',
            trend: 'up',
            color: 'text-emerald-400',
          },
          {
            id: '2',
            title: 'Total Spending',
            value: '$1,423.00',
            change: '-5%',
            trend: 'down',
            color: 'text-purple-400',
          },
          {
            id: '3',
            title: 'Active Users',
            value: '2,345',
            change: '+12%',
            trend: 'up',
            color: 'text-blue-400',
          },
          {
            id: '4',
            title: 'Yield Earned',
            value: '$456.23',
            change: '+2.4%',
            trend: 'up',
            color: 'text-yellow-400',
          },
        ]

        // Mock chart data (last 7 days)
        const chartData: DashboardChartData[] = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          balance: 30000 + Math.random() * 5000,
        }))

        // Mock recent transactions
        const recentTransactions: DashboardTransaction[] = [
          {
            id: '1',
            type: 'expense',
            amount: -150,
            description: 'Grocery Store',
            date: '2 hours ago',
            status: 'completed',
          },
          {
            id: '2',
            type: 'income',
            amount: 500,
            description: 'Freelance Work',
            date: '1 day ago',
            status: 'completed',
          },
          {
            id: '3',
            type: 'expense',
            amount: -75,
            description: 'Gas Station',
            date: '2 days ago',
            status: 'completed',
          },
        ]

        return {
          kpis,
          chartData,
          recentTransactions,
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch dashboard')
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
