'use client';

import { useFlaggedTransactions } from '@/hooks/api/useFraud';
import {
  getRiskLevelBadgeClass,
  getStatusBadgeClass,
  getTransactionTypeIcon,
  formatFlaggedAmount,
} from '@/lib/adapters/fraudAdapters';
import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { FlaggedTransaction, FraudFilters } from '@/types/fraud';

export function FlaggedTransactionsTable() {
  const [filters, setFilters] = useState<FraudFilters>({
    status: undefined,
    riskLevel: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    type: undefined,
  });

  const { data, loading, error, hasMore, refetch } = useFlaggedTransactions(filters);

  const handleFilterChange = (key: keyof FraudFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-700 dark:text-red-300">
          Failed to load flagged transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID or user..."
            className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
          />
        </div>
        <select
          value={filters.riskLevel || ''}
          onChange={(e) => handleFilterChange('riskLevel', e.target.value || undefined)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
        >
          <option value="">All Risk Levels</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Type
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Amount
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                User
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Risk Level
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                Date
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No flagged transactions found
                </td>
              </tr>
            ) : (
              data?.map((txn: FlaggedTransaction) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-mono text-xs">
                    {txn.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-lg">{getTransactionTypeIcon(txn.type)}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {formatFlaggedAmount(txn.amount, 'USD')}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {txn.fromUser?.name}
                      </p>
                      <p className="text-xs text-gray-500">{txn.fromUser?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelBadgeClass(txn.riskLevel)}`}>
                      {txn.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
