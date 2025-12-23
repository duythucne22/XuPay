/**
 * Verification Timeline Component
 * Displays historical verification events in chronological order
 */

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { VerificationEvent } from '@/types/kyc';
import {
  formatVerificationStatus,
  formatVerificationTimestamp,
  formatKYCTime,
} from '@/lib/adapters/kycAdapters';

interface VerificationTimelineProps {
  events: VerificationEvent[];
  isLoading?: boolean;
}

const EVENT_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  verification_started: {
    label: 'Verification Started',
    icon: '🚀',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  document_uploaded: {
    label: 'Document Uploaded',
    icon: '📤',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  verification_completed: {
    label: 'Verification Completed',
    icon: '✓',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  verification_failed: {
    label: 'Verification Failed',
    icon: '✕',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
  tier_upgraded: {
    label: 'Tier Upgraded',
    icon: '⬆️',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  tier_downgraded: {
    label: 'Tier Downgraded',
    icon: '⬇️',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
  verification_expired: {
    label: 'Verification Expired',
    icon: '⚠️',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
};

export function VerificationTimeline({ events, isLoading }: VerificationTimelineProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center py-8">
          <Clock className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No verification events yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Start your verification to see timeline
          </p>
        </div>
      </div>
    );
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Verification Timeline
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* Timeline */}
      <div className="px-6 py-4">
        <div className="space-y-6">
          {sortedEvents.map((event, idx) => {
            const config = EVENT_CONFIG[event.type] || {
              label: event.type,
              icon: '•',
              color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
            };

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4"
              >
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${config.color}`}>
                    {config.icon}
                  </div>
                  {/* Connection Line */}
                  {idx < sortedEvents.length - 1 && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {config.label}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatVerificationTimestamp(event.timestamp)}
                    </span>
                  </div>

                  {/* Time */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {formatKYCTime(event.timestamp)}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {event.details}
                  </p>

                  {/* Status Badge */}
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mb-2">
                    {event.status === 'pending' && '⏳ '}
                    {event.status === 'verified' && '✓ '}
                    {event.status === 'rejected' && '✕ '}
                    {formatVerificationStatus(event.status)}
                  </div>

                  {/* Rejection Reason */}
                  {event.status === 'rejected' && event.rejectionReason && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700 dark:text-red-300">
                          <span className="font-medium">Rejection reason:</span> {event.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reviewer Info */}
                  {event.reviewedBy && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Reviewed by <span className="font-medium">{event.reviewedBy}</span>
                      </p>
                      {event.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                          "{event.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
