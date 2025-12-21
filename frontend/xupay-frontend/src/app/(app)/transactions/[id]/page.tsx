'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { mockTransactions, mockUsers, mockWallets, formatCurrency, formatDate, getTransactionTypeLabel } from '@/lib/mock-data'

interface TransactionDetailPageProps {
  params: {
    id: string
  }
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  // In a real app, fetch from API
  const transaction = mockTransactions.find((t) => t.id === params.id) || mockTransactions[0]
  const fromUser = transaction.fromUserId
    ? mockUsers.find((u) => u.id === transaction.fromUserId)
    : null
  const toUser = transaction.toUserId
    ? mockUsers.find((u) => u.id === transaction.toUserId)
    : null
  const fromWallet = transaction.fromWalletId
    ? mockWallets.find((w) => w.id === transaction.fromWalletId)
    : null
  const toWallet = transaction.toWalletId
    ? mockWallets.find((w) => w.id === transaction.toWalletId)
    : null

  const statusColor = {
    completed: 'bg-green-50 border-green-200 text-green-700',
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    processing: 'bg-blue-50 border-blue-200 text-blue-700',
    failed: 'bg-red-50 border-red-200 text-red-700',
    cancelled: 'bg-gray-50 border-gray-200 text-gray-700',
    reversed: 'bg-orange-50 border-orange-200 text-orange-700',
  }[transaction.status]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/transactions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Transaction ${transaction.id.substring(0, 8)}`}
        description="View detailed transaction information and history"
      />

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`border ${statusColor}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-75">Transaction Status</p>
                <p className="text-2xl font-bold capitalize">{transaction.status}</p>
              </div>
              <Badge className={statusColor}>{transaction.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{getTransactionTypeLabel(transaction.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(transaction.amountCents, transaction.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{transaction.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{transaction.status}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* From/To Details */}
            <div className="grid grid-cols-2 gap-6">
              {/* From */}
              <div>
                <h3 className="font-semibold mb-4">From</h3>
                {fromUser && (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">User</p>
                      <p className="font-medium">{fromUser.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-mono text-sm">{fromUser.email}</p>
                    </div>
                  </div>
                )}
                {fromWallet && (
                  <div className="space-y-2 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet ID</p>
                      <p className="font-mono text-sm">{fromWallet.id.substring(0, 12)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{fromWallet.type}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* To */}
              <div>
                <h3 className="font-semibold mb-4">To</h3>
                {toUser && (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">User</p>
                      <p className="font-medium">{toUser.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-mono text-sm">{toUser.email}</p>
                    </div>
                  </div>
                )}
                {toWallet && (
                  <div className="space-y-2 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet ID</p>
                      <p className="font-mono text-sm">{toWallet.id.substring(0, 12)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{toWallet.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Additional Info */}
            <div>
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{transaction.description || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reference Number</p>
                  <p className="font-mono text-sm">{transaction.referenceNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idempotency Key</p>
                  <p className="font-mono text-xs">{transaction.idempotencyKey.substring(0, 16)}...</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(transaction.createdAt)}</p>
                </div>
                {transaction.completedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completed At</p>
                    <p className="font-medium">{formatDate(transaction.completedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Fraud Detection */}
            <div>
              <h3 className="font-semibold mb-4">Fraud Detection</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fraud Score</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{transaction.fraudScore}</p>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <Badge
                    variant="outline"
                    className={
                      transaction.riskLevel === 'low'
                        ? 'border-green-200 text-green-700'
                        : transaction.riskLevel === 'medium'
                          ? 'border-yellow-200 text-yellow-700'
                          : transaction.riskLevel === 'high'
                            ? 'border-orange-200 text-orange-700'
                            : 'border-red-200 text-red-700'
                    }
                  >
                    {transaction.riskLevel}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="font-medium">{transaction.isFlagged ? 'Yes' : 'No'}</p>
                </div>
                {transaction.fraudReason && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium text-sm">{transaction.fraudReason}</p>
                  </div>
                )}
              </div>
            </div>

            {transaction.isReversed && (
              <>
                <Separator />
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-orange-900">Reversal Information</h3>
                  <div className="space-y-2">
                    {transaction.reversedByTransactionId && (
                      <div>
                        <p className="text-sm text-muted-foreground">Reversed By Transaction</p>
                        <p className="font-mono text-sm">{transaction.reversedByTransactionId}</p>
                      </div>
                    )}
                    {transaction.reversalReason && (
                      <div>
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="text-sm">{transaction.reversalReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
