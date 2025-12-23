/**
 * KYC Limits Card Component
 * Displays transaction limits and restrictions based on verification tier
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, AlertCircle } from 'lucide-react';
import { KYCLimits } from '@/types/kyc';
import { formatLimitAmount, getVerificationTierBadgeClass, formatVerificationTier } from '@/lib/adapters/kycAdapters';

interface KYCLimitsCardProps {
  limits: KYCLimits | null;
  isLoading?: boolean;
}

const LIMIT_ITEMS = [
  { key: 'dailyTransactionLimit', label: 'Daily Transaction Limit', icon: '📊' },
  { key: 'monthlyTransactionLimit', label: 'Monthly Transaction Limit', icon: '📈' },
  { key: 'dailyWithdrawalLimit', label: 'Daily Withdrawal Limit', icon: '💰' },
  { key: 'maxWalletBalance', label: 'Max Wallet Balance', icon: '💳' },
  { key: 'maxP2PTransferAmount', label: 'Max P2P Transfer', icon: '↔️' },
] as const;

const CAPABILITY_ITEMS = [
  { key: 'canTransferFunds', label: 'Transfer Funds' },
  { key: 'canWithdraw', label: 'Withdraw' },
  { key: 'canReceiveTransfers', label: 'Receive Transfers' },
] as const;

export function KYCLimitsCard({ limits, isLoading }: KYCLimitsCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!limits) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">Unable to load limits. Please try again.</p>
        </div>
      </div>
    );
  }

  const limitEntries = LIMIT_ITEMS.map((item) => ({
    ...item,
    value: limits[item.key as keyof KYCLimits],
  })) as Array<{
    key: string;
    label: string;
    icon: string;
    value: number;
  }>;

  const capabilityEntries = CAPABILITY_ITEMS.map((item) => ({
    ...item,
    enabled: limits[item.key as keyof KYCLimits],
  })) as Array<{
    key: string;
    label: string;
    enabled: boolean;
  }>;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Limits
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Based on your verification tier
          </p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVerificationTierBadgeClass(limits.tier)}`}>
          {formatVerificationTier(limits.tier)}
        </span>
      </div>

      {/* Limits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {limitEntries.map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatLimitAmount(item.value as number)}
                </p>
              </div>
              <span className="text-xl">{item.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Capabilities Section */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Available Features
        </h4>
        <div className="space-y-3">
          {capabilityEntries.map((item, idx) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center ${
                item.enabled
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {item.enabled ? (
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">✓</span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 text-xs">—</span>
                )}
              </div>
              <span className={`text-sm font-medium ${
                item.enabled
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {item.label}
              </span>
              {!item.enabled && (
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-500">
                  Upgrade tier
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Upgrade your tier
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Complete additional verification steps to unlock higher transaction limits and additional features.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
