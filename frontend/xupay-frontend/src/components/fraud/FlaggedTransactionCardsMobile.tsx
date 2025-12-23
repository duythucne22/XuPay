'use client';

import { useFlaggedTransactions } from '@/hooks/api/useFraud';
import {
  getRiskLevelBadgeClass,
  getStatusBadgeClass,
  getTransactionTypeIcon,
  formatFlaggedAmount,
} from '@/lib/adapters/fraudAdapters';
import { ChevronRight } from 'lucide-react';
import { FlaggedTransaction, FraudFilters } from '@/types/fraud';
import { useState } from 'react';

export function FlaggedTransactionCard({ transaction }: { transaction: FlaggedTransaction }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{getTransactionTypeIcon(transaction.type)}</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {transaction.fromUser?.name}
            </p>
            <p className="text-xs text-gray-500">{transaction.fromUser?.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm">Amount</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatFlaggedAmount(transaction.amount, 'USD')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm">ID</span>
          <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
            {transaction.id.slice(0, 12)}...
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-1 text-center ${getRiskLevelBadgeClass(transaction.riskLevel)}`}>
          {transaction.riskLevel}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-1 text-center ${getStatusBadgeClass(transaction.status)}`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
}

export function FlaggedTransactionsMobile() {
  const [filters] = useState<FraudFilters>({});
  const { data, loading, error } = useFlaggedTransactions(filters);

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
    <div className="lg:hidden space-y-3">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : data?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No flagged transactions found
        </div>
      ) : (
        data?.map((txn: FlaggedTransaction) => (
          <FlaggedTransactionCard key={txn.id} transaction={txn} />
        ))
      )}
    </div>
  );
}
