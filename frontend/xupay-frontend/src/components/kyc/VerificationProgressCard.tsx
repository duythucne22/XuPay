/**
 * KYC Verification Progress Card Component
 * Displays visual progress of KYC verification process
 */

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getProgressColor, formatVerificationStatus } from '@/lib/adapters/kycAdapters';
import { KYCLimitTier, VerificationStatus } from '@/types/kyc';

interface VerificationProgressCardProps {
  status: VerificationStatus;
  tier: KYCLimitTier;
  progress: number; // 0-100
  completedSteps: string[];
  remainingSteps: string[];
  isLoading?: boolean;
}

/**
 * Step labels for display
 */
const STEP_LABELS: Record<string, string> = {
  government_id: 'Government ID',
  address_proof: 'Address Proof',
  selfie: 'Selfie Verification',
};

export function VerificationProgressCard({
  status,
  tier,
  progress,
  completedSteps,
  remainingSteps,
  isLoading,
}: VerificationProgressCardProps) {
  const isVerified = status === 'verified';
  const isRejected = status === 'rejected';
  const isPending = status === 'pending';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Verification Status
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatVerificationStatus(status)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progress}%
          </div>
          <div className={`text-xs font-medium mt-1 ${
            isVerified ? 'text-green-600 dark:text-green-400' :
            isRejected ? 'text-red-600 dark:text-red-400' :
            isPending ? 'text-blue-600 dark:text-blue-400' :
            'text-gray-600 dark:text-gray-400'
          }`}>
            {isVerified ? '✓ Verified' :
             isRejected ? '✕ Rejected' :
             isPending ? '⏳ Under Review' :
             '⭘ Not Started'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Verification Progress
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {completedSteps.length} of {completedSteps.length + remainingSteps.length} steps
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${getProgressColor(progress)}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {/* Completed Steps */}
        {completedSteps.map((step) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {STEP_LABELS[step] || step}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              Completed
            </span>
          </motion.div>
        ))}

        {/* Current Step (if pending) */}
        {isPending && remainingSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {STEP_LABELS[remainingSteps[0]] || remainingSteps[0]}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              In Progress
            </span>
          </motion.div>
        )}

        {/* Remaining Steps */}
        {remainingSteps.slice(isPending ? 1 : 0).map((step) => (
          <div key={step} className="flex items-center gap-3 opacity-50">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {STEP_LABELS[step] || step}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">
              Pending
            </span>
          </div>
        ))}

        {/* Rejected status */}
        {isRejected && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Verification rejected. Please resubmit.
            </span>
          </motion.div>
        )}
      </div>

      {/* Tier Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Current Tier
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {tier}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white animate-spin" />
        </div>
      )}
    </div>
  );
}
