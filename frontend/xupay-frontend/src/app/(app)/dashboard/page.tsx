/* ============================================
   DASHBOARD PAGE
   Route: /dashboard
   ============================================ */

'use client'

import { useAuth } from '@/providers'
import { PageHeader } from '@/components/common'
import { PageTransition, FadeIn } from '@/components/animations'
import { BalanceCard } from '@/components/features/dashboard/BalanceCard'
import { StatsGrid } from '@/components/features/dashboard/StatsGrid'
import { RecentTransactions } from '@/components/features/dashboard/RecentTransactions'
import { QuickActions } from '@/components/features/dashboard/QuickActions'

// ============================================
// MOCK DATA (until backend is connected)
// ============================================

const mockBalance = '₫ 50,000,000.00'

// ============================================
// DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  const { user } = useAuth()

  // These will work when backend is connected
  // const { data: txStats, isLoading: txLoading } = useTransactionStats()
  // const { data: sarStats, isLoading: sarLoading } = useSarStats()
  // const { data: platformBalance, isLoading: balanceLoading } = usePlatformBalance()

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={`Welcome back, ${user?.firstName ?? 'Admin'}`}
          description="Here's what's happening with your platform today."
        />

        {/* Balance Card */}
        <FadeIn>
          <BalanceCard balance={mockBalance} walletsActive={12} updatedAgo="5m" />
        </FadeIn>

        {/* Stats Grid */}
        <FadeIn delay={0.1}>
          <StatsGrid />
        </FadeIn>

        {/* Recent Transactions */}
        <FadeIn delay={0.2}>
          <RecentTransactions />
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={0.3}>
          <QuickActions />
        </FadeIn>
      </div>
    </PageTransition>
  )
}
