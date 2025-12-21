'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockWallets, formatCurrency } from '@/lib/mock-data'

export default function WalletsPage() {
  const [hiddenWallets, setHiddenWallets] = useState<string[]>([])

  const toggleHideWallet = (walletId: string) => {
    setHiddenWallets((prev) =>
      prev.includes(walletId) ? prev.filter((id) => id !== walletId) : [...prev, walletId]
    )
  }

  const totalBalance = mockWallets.reduce((sum, w) => sum + w.balance, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallets"
        description="Manage your digital wallets and balances"
        action={
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Wallet
          </Button>
        }
      />

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Balance (All Wallets)</p>
            <p className="text-4xl font-bold">{formatCurrency(totalBalance, 'VND')}</p>
            <p className="text-xs text-muted-foreground mt-2">Across {mockWallets.length} wallets</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWallets.map((wallet, idx) => (
          <motion.div
            key={wallet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <Link href={`/wallets/${wallet.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-200 h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base capitalize">{wallet.type} Wallet</CardTitle>
                      <CardDescription className="text-xs mt-1">{wallet.glAccountCode}</CardDescription>
                    </div>
                    <Badge variant={wallet.status === 'active' ? 'default' : 'secondary'}>
                      {wallet.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Balance */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className="text-2xl font-bold">
                      {hiddenWallets.includes(wallet.id) ? '••••••' : formatCurrency(wallet.balance, wallet.currency)}
                    </p>
                  </div>

                  {/* Currency */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-muted-foreground">Currency</p>
                      <p className="font-medium">{wallet.currency}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleHideWallet(wallet.id)
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {hiddenWallets.includes(wallet.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-muted-foreground">
                    Created {wallet.createdAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {mockWallets.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground mb-4">No wallets yet</p>
            <Button>Create Your First Wallet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
