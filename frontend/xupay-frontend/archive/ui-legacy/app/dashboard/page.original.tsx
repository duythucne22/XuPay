'use client'

import React from 'react'
import Image from 'next/image'
import { Wallet, Users, CreditCard, TrendingUp, Calendar } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BalanceHistoryChart } from '@/components/dashboard/BalanceHistoryChart'
import { NeoCard } from '@/components/ui/NeoCard'
import { useDashboardOverview } from '@/hooks/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview()

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-in fade-in duration-500">
        <div className="card-base max-w-md w-full text-center p-8">
          <div className="text-red-500 mb-4">
            {/* replace inline SVG with Icon wrapper for consistency (observation only, no commit) */}
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-400 mb-6">We couldn't fetch your dashboard data. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Page Header */}
      <div className="flex flex-row max-md:flex-col items-start max-md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl max-md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Good Afternoon, User&apos;s!
          </h1>
          <p className="text-gray-400 mt-1">Here is what&apos;s happening with your wallet today.</p>
        </div>
        
        {/* Date Filter (Static for now) */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-300">Dec 23, 2025</span>
        </div>
      </div>

      {/* 2. KPI Stats Grid (Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col) - DESKTOP-FIRST */}
      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
        {isLoading ? (
          // Loading Skeletons
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-base p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </>
        ) : (
          // KPI Cards with Real Data
          data?.kpis.map((kpi, index) => {
            const icons = [
              <Wallet key="wallet" />,
              <CreditCard key="card" />,
              <Users key="users" />,
              <TrendingUp key="trending" />
            ]
            const iconColors = [
              'text-emerald-400',
              'text-purple-400',
              'text-blue-400',
              'text-yellow-400'
            ]
            
            return (
              <StatCard 
                key={kpi.title}
                title={kpi.title} 
                value={kpi.value} 
                change={kpi.change} 
                trend={kpi.trend} 
                icon={icons[index]} 
                iconColor={iconColors[index]}
              />
            )
          })
        )}
      </div>

      {/* 3. Main Layout Grid (Desktop: 2/3 + 1/3, Mobile: Stack) - DESKTOP-FIRST */}
      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-8">
        
        {/* LEFT COLUMN (2/3 on desktop, full width on mobile) */}
        <div className="col-span-2 max-lg:col-span-1 space-y-8">
          
          {/* Balance History Chart */}
          {isLoading ? (
            <div className="card-base p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <BalanceHistoryChart 
              data={data?.chartData || []} 
              walletName="Balance History"
            />
          )}

          {/* Recent Transactions */}
          {isLoading ? (
            <div className="card-base p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <RecentTransactions transactions={data?.recentTransactions || []} />
          )}
        </div>        

        {/* RIGHT COLUMN (1/3 on desktop, full width on mobile) */}
        <div className="col-span-1 max-lg:col-span-1 space-y-8">
          
          {/* My Cards Preview */}
          <NeoCard className="p-6 bg-gradient-to-br from-emerald-900/20 to-black/40">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-white">My Cards</h3>
              <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                + Add
              </button>
            </div>
            
            {/* Visual Credit Card */}
            <div className="aspect-[1.586/1] rounded-xl bg-gradient-to-br from-purple-600 to-indigo-900 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-white/20 transition-all" />
              
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-white/70">DEBIT</span>
                <span className="font-bold text-white tracking-widest italic">VISA</span>
              </div>
              <div>
                <p className="font-mono text-xl text-white tracking-wider mb-2">•••• •••• •••• 4242</p>
                <div className="flex justify-between text-xs text-white/70">
                  <span>JOHN DOE</span>
                  <span>12/28</span>
                </div>
              </div>
            </div>
          </NeoCard>

          {/* Quick Actions (Replacer for QuickActions.tsx) */}
          <NeoCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Quick Transfer</h3>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt={`User ${i}`}
                      width={48}
                      height={48}
                      className="w-full h-full rounded-full opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-emerald-400">Alex</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                  +
                </div>
                <span className="text-xs text-gray-400">Add</span>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="text-xs text-gray-500 uppercase font-semibold">Amount</label>
              <div className="flex items-center gap-2 mt-2 p-3 bg-black/40 rounded-xl border border-white/10 focus-within:border-emerald-500/50 transition-colors">
                <span className="text-gray-400">$</span>
                <input 
                  type="text" 
                  placeholder="0.00" 
                  className="bg-transparent border-none outline-none text-white w-full font-mono"
                />
                <button className="bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Send
                </button>
              </div>
            </div>
          </NeoCard>

        </div>
      </div>
    </div>
  )
}