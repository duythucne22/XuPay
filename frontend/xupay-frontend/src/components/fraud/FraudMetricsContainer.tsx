'use client';

import { useFraudMetrics } from '@/hooks/api/useFraud';
import { FraudMetricsCard } from './FraudMetricsCard';
import { AlertTriangle, DollarSign, TrendingUp, PieChart } from 'lucide-react';

export function FraudMetricsContainer() {
  const { data, loading, error } = useFraudMetrics();

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-700 dark:text-red-300">
          Failed to load fraud metrics. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Flagged Transactions */}
      <FraudMetricsCard
        label="Flagged Transactions"
        value={data?.totalFlagged || 0}
        change={5.2}
        trend="up"
        icon={<AlertTriangle className="w-5 h-5" />}
        color="red"
        loading={loading}
      />

      {/* Flagged Amount */}
      <FraudMetricsCard
        label="Flagged Amount"
        value={
          data?.flaggedAmount
            ? `$${(data.flaggedAmount / 1000).toFixed(1)}K`
            : '$0'
        }
        change={-3.1}
        trend="down"
        icon={<DollarSign className="w-5 h-5" />}
        color="yellow"
        loading={loading}
      />

      {/* Flagged Rate */}
      <FraudMetricsCard
        label="Flagged Rate"
        value={`${(data?.flaggedPercent || 0).toFixed(2)}%`}
        icon={<TrendingUp className="w-5 h-5" />}
        color="blue"
        loading={loading}
      />

      {/* Critical Risk */}
      <FraudMetricsCard
        label="Critical Risk"
        value={data?.riskDistribution?.CRITICAL || 0}
        change={2.0}
        trend="up"
        icon={<PieChart className="w-5 h-5" />}
        color="purple"
        loading={loading}
      />
    </div>
  );
}
