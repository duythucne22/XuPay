'use client';

import { useState } from 'react';
import { useFraudTransactionAction } from '@/hooks/api/useFraud';
import { Check, X, Eye } from 'lucide-react';

export function RiskActionButtons({ transactionId }: { transactionId: string }) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const { execute, loading } = useFraudTransactionAction();

  const handleAction = async (action: 'approve' | 'block' | 'review') => {
    const success = await execute(transactionId, action, reason);
    if (success) {
      setSelectedAction(null);
      setReason('');
      // Could show a success toast here
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setSelectedAction('approve')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => setSelectedAction('review')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Eye className="w-4 h-4" />
          Review
        </button>
        <button
          onClick={() => setSelectedAction('block')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Block
        </button>
      </div>

      {/* Reason Input */}
      {selectedAction && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Reason for {selectedAction === 'approve' ? 'approval' : selectedAction === 'block' ? 'blocking' : 'review'}
            </span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your decision..."
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg text-sm font-normal"
              rows={3}
            />
          </label>

          <div className="flex gap-2">
            <button
              onClick={() => handleAction(selectedAction as 'approve' | 'block' | 'review')}
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
            <button
              onClick={() => {
                setSelectedAction(null);
                setReason('');
              }}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
