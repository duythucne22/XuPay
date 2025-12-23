'use client'

import React, { useState } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps 
} from 'recharts'
import { NeoCard } from '@/components/ui/NeoCard'
import { Button } from '@/components/ui/button'

// Mock Data: Simulating a realistic balance curve
const DATA = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 3800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
]

// Custom Tooltip Component (Glass Style)
const CustomTooltip = (props: TooltipProps<number, string> & { payload?: any[] }) => {
  const { active, payload } = props
  if (active && payload && payload.length) {
    const label = payload[0].payload?.name
    return (
      <div style={{ backgroundColor: 'rgba(var(--color-bg-primary-rgb), 0.9)', borderColor: 'rgba(var(--color-text-primary-rgb), 0.1)' }} className="backdrop-blur-md border p-3 rounded-xl shadow-xl shadow-black/50">
        <p className="text-[var(--color-text-muted)] text-xs mb-1">{label}</p>
        <p className="text-[var(--color-success)] font-bold text-lg">
          ${payload[0].value?.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function BalanceHistoryChart({ data: propData = DATA, walletName = 'Balance History', currency = 'USD' }: {
  data?: { date?: string; name?: string; balance?: number; value?: number }[]
  walletName?: string
  currency?: string
}) {
  const [range, setRange] = useState('7d')

  const points = propData.map((d: any) => ({
    name: d.date ?? d.name,
    value: (d.balance ?? d.value ?? 0)
  }))

  const values = points.map((p) => p.value)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const avg = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0

  const formatCurrency = (v: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(v)
    } catch (e) {
      return `$${v.toFixed(2)}`
    }
  }

  return (
    <NeoCard className="h-[400px] flex flex-col p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg text-white">Balance History</h3>
          <div className="flex flex-col items-start gap-2 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{formatCurrency(values[values.length - 1] ?? 0)}</span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {values.length ? `${(((values[values.length - 1] - (values[0] || values[values.length - 1])) / (values[0] || 1)) * 100).toFixed(1)}%` : '+0%'}
              </span>
            </div>
            <div className="text-xs text-gray-400">Min • Max • Average</div>
          </div>
        </div>

        {/* Range Toggles */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {['1d', '7d', '1m', '1y'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`
                px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200
                ${range === r 
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 w-full min-h-0" data-testid="balance-history-chart">
        {process.env.NODE_ENV === 'test' ? (
          // Fallback rendering for test environment (JSDOM doesn't layout elements reliably)
          <div data-testid="recharts-fallback">
            <AreaChart
              width={800}
              height={300}
              data={points}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >

              <defs>
                {/* The "Neon Glow" Gradient */}
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-text-primary)" 
                opacity={0.05} 
                vertical={false} 
              />
              
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              
              <YAxis 
                stroke="var(--color-text-muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'var(--color-success)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-success)" // Emerald-500
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ 
                  r: 6, 
                  fill: 'var(--color-bg-primary)', // Black center
                  stroke: 'var(--color-success)', // Neon border
                  strokeWidth: 3 
                }}
              />
            </AreaChart>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >

              <defs>
                {/* The "Neon Glow" Gradient */}
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-text-primary)" 
                opacity={0.05} 
                vertical={false} 
              />
              
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              
              <YAxis 
                stroke="var(--color-text-muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'var(--color-success)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-success)" // Emerald-500
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ 
                  r: 6, 
                  fill: 'var(--color-bg-primary)', // Black center
                  stroke: 'var(--color-success)', // Neon border
                  strokeWidth: 3 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Stats */}
      <div className="pt-6 flex items-center gap-6 text-sm text-[var(--color-text-muted)]" style={{ borderTopColor: 'rgba(var(--color-text-primary-rgb), 0.05)', borderTopWidth: 1, borderTopStyle: 'solid' }}>
        <div>
          <div className="text-xs text-gray-400">Highest</div>
          <div className="font-medium text-white">{formatCurrency(max)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Lowest</div>
          <div className="font-medium text-white">{formatCurrency(min)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Average:</div>
          <div className="font-medium text-white">{formatCurrency(avg)}</div>
        </div>
      </div>
    </NeoCard>
  )
}