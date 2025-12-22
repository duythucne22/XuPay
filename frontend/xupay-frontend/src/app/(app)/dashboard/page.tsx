'use client'

import React from 'react'
import { Wallet, Users, CreditCard, TrendingUp, Calendar } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BalanceHistoryChart } from '@/components/dashboard/BalanceHistoryChart'
import { NeoCard } from '@/components/ui/NeoCard'

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Page Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Good Afternoon, User!
          </h1>
          <p className="text-gray-400 mt-1">Here is what's happening with your wallet today.</p>
        </div>
        
        {/* Date Filter (Static for now) */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-300">Oct 25, 2025</span>
        </div>
      </div>

      {/* 2. Stats Grid (Row 1) */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard 
          title="Total Balance" 
          value="$32,126.00" 
          change="+15%" 
          trend="up" 
          icon={<Wallet />} 
        />
        <StatCard 
          title="Total Spending" 
          value="$1,423.00" 
          change="-5%" 
          trend="down" 
          icon={<CreditCard />}
          iconColor="text-purple-400" 
        />
        <StatCard 
          title="Active Users" 
          value="2,345" 
          change="+12%" 
          trend="up" 
          icon={<Users />}
          iconColor="text-blue-400"
        />
        <StatCard 
          title="Yield Earned" 
          value="$456.23" 
          change="+2.4%" 
          trend="up" 
          icon={<TrendingUp />}
          iconColor="text-yellow-400"
        />
      </div>

      {/* 3. Main Layout Grid (Row 2) */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8/12) */}
        <div className="col-span-8 space-y-8">
          
          {/* Chart Placeholder (We will build BalanceHistoryChart next) */}
          <BalanceHistoryChart />

          {/* Transactions List */}
          <RecentTransactions />
        </div>        

        {/* RIGHT COLUMN (4/12) */}
        <div className="col-span-4 space-y-8">
          
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
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="User" 
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