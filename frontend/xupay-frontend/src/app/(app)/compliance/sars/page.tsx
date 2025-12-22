'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Filter, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockSARs, mockTransactions, formatDate, getSARSeverityColor } from '@/lib/mock-data'
import type { SAR } from '@/types'

export default function SARsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<SAR['severity'] | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<SAR['status'] | 'all'>('all')

  const severityOptions: Array<{ value: SAR['severity'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ]

  const statusOptions: Array<{ value: SAR['status'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' },
  ]

  // Filter SARs
  const filteredSARs = useMemo(() => {
    return mockSARs.filter((sar) => {
      const matchesSeverity = selectedSeverity === 'all' || sar.severity === selectedSeverity
      const matchesStatus = selectedStatus === 'all' || sar.status === selectedStatus
      return matchesSeverity && matchesStatus
    })
  }, [selectedSeverity, selectedStatus])

  // Stats
  const stats = {
    total: mockSARs.length,
    open: mockSARs.filter((s) => s.status === 'open').length,
    reviewing: mockSARs.filter((s) => s.status === 'under_review').length,
    critical: mockSARs.filter((s) => s.severity === 'critical').length,
  }

  const severityColor: Record<SAR['severity'], string> = {
    low: 'bg-blue-50 border-blue-200 text-blue-700',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    high: 'bg-orange-50 border-orange-200 text-orange-700',
    critical: 'bg-red-50 border-red-200 text-red-700',
  }

  const statusColor: Record<SAR['status'], string> = {
    open: 'bg-red-50 border-red-200 text-red-700',
    under_review: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    resolved: 'bg-green-50 border-green-200 text-green-700',
    dismissed: 'bg-gray-50 border-gray-200 text-gray-700',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suspicious Activity Reports"
        description="Manage and review SARs for compliance"
        action={
          <Button>
            <AlertCircle className="w-4 h-4 mr-2" />
            New SAR
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total SARs', value: stats.total, color: 'bg-blue-50' },
          { label: 'Open', value: stats.open, color: 'bg-red-50' },
          { label: 'Under Review', value: stats.reviewing, color: 'bg-yellow-50' },
          { label: 'Critical', value: stats.critical, color: 'bg-red-100' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className={stat.color}>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {severityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
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

      {/* SARs Table */}
      <Card>
        <CardHeader>
          <CardTitle>SARs List</CardTitle>
          <CardDescription>Showing {filteredSARs.length} of {mockSARs.length} reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSARs.map((sar) => {
                  const transaction = mockTransactions.find((t) => t.id === sar.transactionId)
                  return (
                    <motion.tr
                      key={sar.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell className="font-mono text-sm">{sar.id.substring(0, 8)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {sar.transactionId.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${severityColor[sar.severity]}`}>
                          {sar.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${statusColor[sar.status]}`}>
                          {sar.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{sar.reason}</TableCell>
                      <TableCell className="text-sm">{formatDate(sar.createdAt).split(',')[0]}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/compliance/sars/${sar.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredSARs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No SARs found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
