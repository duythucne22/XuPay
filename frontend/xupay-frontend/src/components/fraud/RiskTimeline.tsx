'use client';

import { RiskHistoryEvent } from '@/types/fraud';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const getRiskLevelIcon = (level: string) => {
  switch (level) {
    case 'CRITICAL':
    case 'HIGH':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'MEDIUM':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'LOW':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'CRITICAL':
    case 'HIGH':
      return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    case 'MEDIUM':
      return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    case 'LOW':
      return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800';
  }
};

export function RiskTimeline({ events }: { events: RiskHistoryEvent[] }) {
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Risk History
      </h3>

      <div className="space-y-4">
        {sortedEvents.map((event, idx) => (
          <div key={event.id || idx} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                {getRiskLevelIcon(event.riskLevel)}
              </div>
              {idx < sortedEvents.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 my-2" />
              )}
            </div>

            {/* Event content */}
            <div className={`flex-1 p-4 rounded-lg border ${getRiskLevelColor(event.riskLevel)}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                  {event.riskLevel} Risk {event.resolved ? '(Resolved)' : '(Active)'}
                </h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(event.timestamp).toLocaleDateString()}{' '}
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {event.reason && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {event.reason}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-300/50 dark:border-gray-600/50">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Risk Score</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {event.score.toFixed(1)}
                  </p>
                </div>
                {event.resolvedAt && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Resolved</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {new Date(event.resolvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <p className="text-center text-gray-500 py-8">No history events</p>
      )}
    </div>
  );
}
