'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { mockTransactions, formatCurrency, formatDate, getTransactionStatusColor, getTransactionTypeLabel } from '@/lib/mock-data'
import type { Transaction } from '@/types'

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState<Transaction['status'] | 'all'>('all')

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.currency.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const statusOptions: Array<{ value: Transaction['status'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'reversed', label: 'Reversed' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage all payment transactions"
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Transaction ID, description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Transactions ({filteredTransactions.length})
          </CardTitle>
          <CardDescription>
            Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((txn) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell className="font-mono text-sm">{txn.id.substring(0, 8)}</TableCell>
                    <TableCell className="font-medium">{getTransactionTypeLabel(txn.type)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(txn.amountCents, txn.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          txn.status === 'completed'
                            ? 'default'
                            : txn.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          txn.riskLevel === 'low'
                            ? 'border-green-200 text-green-700'
                            : txn.riskLevel === 'medium'
                              ? 'border-yellow-200 text-yellow-700'
                              : txn.riskLevel === 'high'
                                ? 'border-orange-200 text-orange-700'
                                : 'border-red-200 text-red-700'
                        }
                      >
                        {txn.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(txn.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/transactions/${txn.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
