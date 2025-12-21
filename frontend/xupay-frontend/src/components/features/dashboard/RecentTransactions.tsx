"use client"

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { History, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface TxnItem {
  id: string
  status: 'completed' | 'pending' | 'failed'
  description: string
  date: string
  amount: string
  direction: 'in' | 'out'
  type: 'Send' | 'Receive' | 'Merchant'
}

interface RecentTransactionsProps {
  items?: TxnItem[]
  className?: string
}

const defaultItems: TxnItem[] = [
  { id: '1', status: 'completed', description: 'Transfer to Bob', date: 'Dec 20, 2025', amount: '₫ -500,000', direction: 'out', type: 'Send' },
  { id: '2', status: 'pending', description: 'From Alice', date: 'Dec 20, 2025', amount: '₫ +1,000,000', direction: 'in', type: 'Receive' },
  { id: '3', status: 'failed', description: 'Merchant Payment', date: 'Dec 19, 2025', amount: '₫ -250,000', direction: 'out', type: 'Merchant' },
]

export function RecentTransactions({ items = defaultItems, className }: RecentTransactionsProps) {
  return (
    <Card className={cn('border rounded-xl overflow-hidden bg-white', className)}>
      <div className="bg-bg-secondary border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary uppercase tracking-wide">
          <span>Recent Transactions</span>
        </div>
        <a className="text-sm text-primary hover:underline" href="#">View All</a>
      </div>

      <div className="divide-y divide-[var(--color-border-light)]">
        <div className="grid grid-cols-[120px_1fr_140px_160px_120px] px-4 py-3 bg-bg-secondary text-xs font-semibold text-text-secondary uppercase tracking-wide">
          <div>Status</div>
          <div>Description</div>
          <div>Date</div>
          <div className="text-right">Amount</div>
          <div>Type</div>
        </div>
        {items.length === 0 && (
          <div className="px-6 py-10 flex items-center gap-3 text-text-tertiary bg-bg-secondary">
            <History className="w-8 h-8" />
            <span>No transactions yet</span>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 grid grid-cols-[120px_1fr_140px_160px_120px] items-center hover:bg-[rgb(249,250,251)] transition-colors">
            <div>
              <Badge variant={item.status === 'completed' ? 'success' : item.status === 'pending' ? 'pending' : 'error'} className="rounded-md px-2 py-0.5">
                {item.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                {item.status === 'pending' && <Clock className="w-3 h-3" />}
                {item.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                <span className="ml-1 capitalize">{item.status}</span>
              </Badge>
            </div>
            <div className="font-medium truncate">{item.description}</div>
            <div className="text-sm text-text-secondary">{item.date}</div>
            <div className={cn('text-sm font-semibold text-right number-display', item.direction === 'out' ? 'text-error' : 'text-success')}>{item.amount}</div>
            <div>
              <Badge variant="outline" className="rounded-md px-2 py-0.5 text-info">
                {item.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
