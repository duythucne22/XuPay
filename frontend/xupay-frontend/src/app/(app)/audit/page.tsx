'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Container } from '@/components/layout/Container'
import { useAuditLog } from '@/hooks/api/useAuditLog'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronUp, ChevronDown } from 'lucide-react'

/**
 * PHASE 1 PR 6: Audit Page
 * 
 * Route: /app/audit
 * Layout: Dashboard
 * Grid: Filters + Table (12-column desktop, cards mobile)
 * Data: useAuditLog()
 */

export default function AuditPage() {
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState({
    action: '',
    actor: '',
    status: undefined as 'success' | 'failed' | undefined,
  })

  const { data, isLoading, error } = useAuditLog({
    limit: 50,
    offset,
    action: filters.action || undefined,
    actor: filters.actor || undefined,
    status: filters.status,
  })

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setOffset(0)
  }

  if (error) {
    return (
      <DashboardLayout>
        <Container>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-600">Failed to load audit log</h2>
              <p className="text-gray-600 mt-2">{error.message}</p>
            </div>
          </div>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Container maxWidth size="lg">
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Audit Log
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View all system activities and operations
            </p>
          </div>

          {/* Filters - desktop 3 → mobile 1 (DESKTOP-FIRST) */}
          <div className="card-base grid grid-cols-3 max-md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action
              </label>
              <input
                type="text"
                placeholder="Filter by action..."
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Actor
              </label>
              <input
                type="text"
                placeholder="Filter by actor..."
                value={filters.actor}
                onChange={(e) => handleFilterChange('actor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  handleFilterChange('status', e.target.value === '' ? undefined : e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Desktop Table View (hidden on mobile/tablet) */}
          <div className="hidden lg:block card-base overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-sticky-header">
                  <th className="table-cell-base text-left font-semibold">Timestamp</th>
                  <th className="table-cell-base text-left font-semibold">Action</th>
                  <th className="table-cell-base text-left font-semibold">Actor</th>
                  <th className="table-cell-base text-left font-semibold">Resource</th>
                  <th className="table-cell-base text-left font-semibold">Status</th>
                  <th className="table-cell-base text-left font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="table-row-hover border-b">
                        <td className="table-cell-base">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="table-cell-base">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="table-cell-base">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="table-cell-base">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="table-cell-base">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="table-cell-base">
                          <Skeleton className="h-4 w-28" />
                        </td>
                      </tr>
                    ))
                  : data?.data.map((entry) => (
                      <tr key={entry.id} className="table-row-hover border-b">
                        <td className="table-cell-base whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td className="table-cell-base font-medium">{entry.action}</td>
                        <td className="table-cell-base">{entry.actor}</td>
                        <td className="table-cell-base">
                          {entry.resource} ({entry.resourceId.substring(0, 8)}...)
                        </td>
                        <td className="table-cell-base">
                          <span
                            className={`badge-${entry.status === 'success' ? 'success' : 'danger'}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="table-cell-base text-xs">{entry.ipAddress}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (visible only on mobile/tablet) */}
          <div className="lg:hidden space-y-4">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))
              : data?.data.map((entry) => (
                  <div key={entry.id} className="card-base">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.action}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`badge-${entry.status === 'success' ? 'success' : 'danger'}`}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Actor:</span> {entry.actor}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Resource:</span> {entry.resource}
                      </p>
                      {entry.ipAddress && (
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">IP:</span> {entry.ipAddress}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {offset + 1} to {Math.min(offset + 50, data?.total || 0)} of{' '}
              {data?.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                disabled={offset === 0 || isLoading}
                onClick={() => setOffset(Math.max(0, offset - 50))}
                className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={!data || offset + 50 >= data.total || isLoading}
                onClick={() => setOffset(offset + 50)}
                className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  )
}
