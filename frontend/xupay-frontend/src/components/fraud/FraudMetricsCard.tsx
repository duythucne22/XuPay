'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface FraudMetricsCardProps {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple';
  loading?: boolean;
}

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
};

const textColorClasses = {
  blue: 'text-blue-700 dark:text-blue-300',
  red: 'text-red-700 dark:text-red-300',
  yellow: 'text-yellow-700 dark:text-yellow-300',
  green: 'text-green-700 dark:text-green-300',
  purple: 'text-purple-700 dark:text-purple-300',
};

export function FraudMetricsCard({
  label,
  value,
  change,
  trend = 'stable',
  icon,
  color,
  loading = false,
}: FraudMetricsCardProps) {
  if (loading) {
    return (
      <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border p-6 ${colorClasses[color]} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${textColorClasses[color]}`}>{icon}</div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>

            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend === 'up' && (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{change.toFixed(1)}% from last period
                    </span>
                  </>
                )}
                {trend === 'down' && (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      -{Math.abs(change).toFixed(1)}% from last period
                    </span>
                  </>
                )}
                {trend === 'stable' && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    No significant change
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {trend === 'up' && (
          <TrendingUp className={`w-12 h-12 opacity-10 ${textColorClasses[color]}`} />
        )}
        {trend === 'down' && (
          <TrendingDown className={`w-12 h-12 opacity-10 ${textColorClasses[color]}`} />
        )}
        {trend === 'stable' && (
          <AlertCircle className={`w-12 h-12 opacity-10 ${textColorClasses[color]}`} />
        )}
      </div>
    </motion.div>
  );
}
