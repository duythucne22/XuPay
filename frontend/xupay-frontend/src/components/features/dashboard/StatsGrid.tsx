"use client"

import { KPICard } from '@/components/common/KPICard'
import { Wallet, BarChart3, Activity, Gauge } from 'lucide-react'

interface StatsGridProps {
  stats?: {
    todayVolume: string
    monthVolume: string
    activeWallets: string
    transferCount: string
    todayChangePct?: number
    monthChangePct?: number
  }
}

export function StatsGrid({
  stats = {
    todayVolume: '₫ 2,450,000',
    monthVolume: '₫ 45,000,000',
    activeWallets: '12',
    transferCount: '348',
    todayChangePct: 12,
    monthChangePct: 4,
  },
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Today's Volume"
        value={stats.todayVolume}
        icon={BarChart3}
        change={{ isPositive: (stats.todayChangePct ?? 0) >= 0, value: Math.abs(stats.todayChangePct ?? 0) }}
        description="vs yesterday"
      />
      <KPICard
        title="This Month"
        value={stats.monthVolume}
        icon={Activity}
        change={{ isPositive: (stats.monthChangePct ?? 0) >= 0, value: Math.abs(stats.monthChangePct ?? 0) }}
        description="vs last month"
      />
      <KPICard
        title="Active Wallets"
        value={stats.activeWallets}
        icon={Wallet}
        description="Currently active"
      />
      <KPICard
        title="Transfers"
        value={stats.transferCount}
        icon={Gauge}
        description="Last 24h"
      />
    </div>
  )
}
