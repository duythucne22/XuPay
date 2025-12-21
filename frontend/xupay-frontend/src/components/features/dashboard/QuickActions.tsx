"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Send, Wallet, ShieldCheck, FileDown } from 'lucide-react'

export function QuickActions() {
  const items = [
    { icon: Send, label: 'Send Money' },
    { icon: Wallet, label: 'Add Wallet' },
    { icon: ShieldCheck, label: 'View Compliance' },
    { icon: FileDown, label: 'Export' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({ icon: Icon, label }) => (
        <Card key={label} className="p-4 hover-lift border bg-white">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-medium">{label}</span>
          </Button>
        </Card>
      ))}
    </div>
  )
}
