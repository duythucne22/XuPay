'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Send, ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { mockWallets, mockTransactions, formatCurrency, formatDate, getTransactionTypeLabel } from '@/lib/mock-data'

interface WalletDetailPageProps {
  params: {
    id: string
  }
}

export default function WalletDetailPage({ params }: WalletDetailPageProps) {
  const wallet = mockWallets.find((w) => w.id === params.id) || mockWallets[0]
  const walletTransactions = mockTransactions.filter(
    (t) => t.fromWalletId === wallet.id || t.toWalletId === wallet.id
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/wallets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`${wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Wallet`}
        description="View wallet details and transaction history"
      />

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
            <p className="text-5xl font-bold mb-4">{formatCurrency(wallet.balance, wallet.currency)}</p>
            <div className="flex gap-3">
              <Button size="sm">
                <Send className="w-4 h-4 mr-2" />
                Send Money
              </Button>
              <Button variant="outline" size="sm">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">ID</p>
                <p className="font-mono text-sm mt-1">{wallet.id.substring(0, 12)}...</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
                <p className="font-medium capitalize mt-1">{wallet.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Currency</p>
                <p className="font-medium mt-1">{wallet.currency}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                <div className="mt-1">
                  <Badge variant={wallet.status === 'active' ? 'default' : 'secondary'}>
                    {wallet.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">GL Account</p>
                <p className="font-mono text-sm mt-1">{wallet.glAccountCode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
                <p className="text-sm mt-1">{formatDate(wallet.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Updated</p>
                <p className="text-sm mt-1">{formatDate(wallet.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p>
                <p className="font-medium mt-1">{wallet.isActive ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Freeze Status */}
      {wallet.isFrozen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="font-semibold text-orange-900 mb-2">Wallet Frozen</p>
              <p className="text-sm text-orange-800">{wallet.freezeReason || 'No reason provided'}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{walletTransactions.length} transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {walletTransactions.length > 0 ? (
              <div className="space-y-4">
                {walletTransactions.map((txn) => {
                  const isOutgoing = txn.fromWalletId === wallet.id
                  return (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isOutgoing
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {isOutgoing ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5 rotate-180" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{getTransactionTypeLabel(txn.type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {txn.description || formatDate(txn.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}>
                          {isOutgoing ? '-' : '+'}
                          {formatCurrency(txn.amountCents, txn.currency)}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1"
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
