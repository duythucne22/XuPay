/**
 * Fraud Data Adapters
 * Maps backend DTOs to frontend UI types
 * 
 * These functions prepare API responses for use in components
 */

import {
  FraudMetrics,
  FlaggedTransaction,
  FraudTrend,
  FraudRule,
} from '@/types/fraud';

/**
 * Map fraud metrics DTO to UI type
 * Handles date conversion and any transformations needed
 */
export function mapFraudMetricsDTO(dto: any): FraudMetrics {
  return {
    totalFlagged: dto.totalFlagged || 0,
    flaggedAmount: dto.flaggedAmount || 0,
    flaggedPercent: dto.flaggedPercent || 0,
    riskDistribution: {
      LOW: dto.riskDistribution?.LOW || 0,
      MEDIUM: dto.riskDistribution?.MEDIUM || 0,
      HIGH: dto.riskDistribution?.HIGH || 0,
      CRITICAL: dto.riskDistribution?.CRITICAL || 0,
    },
    timestamp: new Date(dto.timestamp || new Date()),
  };
}

/**
 * Map flagged transaction DTO to UI type
 * Converts date strings to Date objects
 */
export function mapFlaggedTransactionDTO(dto: any): FlaggedTransaction {
  return {
    id: dto.id || '',
    transactionId: dto.transactionId || '',
    amount: dto.amount || 0,
    type: dto.type || 'TRANSFER',
    fraudScore: dto.fraudScore || 0,
    riskLevel: dto.riskLevel || 'LOW',
    flagged: dto.flagged || false,
    reason: dto.reason,
    createdAt: new Date(dto.createdAt || new Date()),
    status: dto.status || 'pending',
    fromUser: dto.fromUser ? {
      id: dto.fromUser.id || '',
      name: dto.fromUser.name || 'Unknown',
      email: dto.fromUser.email || '',
    } : undefined,
    toUser: dto.toUser ? {
      id: dto.toUser.id || '',
      name: dto.toUser.name || 'Unknown',
      email: dto.toUser.email || '',
    } : undefined,
    wallet: dto.wallet ? {
      id: dto.wallet.id || '',
      name: dto.wallet.name || 'Unknown',
      type: dto.wallet.type || 'PERSONAL',
    } : undefined,
  };
}

/**
 * Map fraud trend DTO to UI type
 */
export function mapFraudTrendDTO(dto: any): FraudTrend {
  return {
    date: dto.date || new Date().toISOString().split('T')[0],
    count: dto.count || 0,
    amount: dto.amount || 0,
    severity: dto.severity || 'LOW',
  };
}

/**
 * Map fraud rule DTO to UI type
 * Converts date strings to Date objects
 */
export function mapFraudRuleDTO(dto: any): FraudRule {
  return {
    id: dto.id || '',
    name: dto.name || '',
    description: dto.description || '',
    condition: dto.condition || '',
    threshold: dto.threshold || 0,
    action: dto.action || 'FLAG',
    enabled: dto.enabled ?? true,
    accuracy: dto.accuracy || 0,
    falsePositiveRate: dto.falsePositiveRate || 0,
    createdAt: new Date(dto.createdAt || new Date()),
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
  };
}

/**
 * Format fraud score with color
 */
export function formatFraudScore(score: number): {
  value: number;
  color: string;
  label: string;
} {
  return {
    value: score,
    color:
      score >= 80
        ? 'text-red-600'
        : score >= 60
          ? 'text-orange-600'
          : score >= 40
            ? 'text-yellow-600'
            : 'text-green-600',
    label:
      score >= 80
        ? 'Very High Risk'
        : score >= 60
          ? 'High Risk'
          : score >= 40
            ? 'Medium Risk'
            : 'Low Risk',
  };
}

/**
 * Format fraud percentage for display
 */
export function formatFraudPercentage(percent: number): string {
  return `${(percent * 100).toFixed(2)}%`;
}

/**
 * Format flagged amount as currency
 */
export function formatFlaggedAmount(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get badge class for risk level
 */
export function getRiskLevelBadgeClass(riskLevel: string): string {
  const baseClass = 'rounded-full px-3 py-1 text-xs font-medium border';

  switch (riskLevel) {
    case 'CRITICAL':
      return `${baseClass} bg-red-500/10 text-red-700 border-red-200`;
    case 'HIGH':
      return `${baseClass} bg-orange-500/10 text-orange-700 border-orange-200`;
    case 'MEDIUM':
      return `${baseClass} bg-yellow-500/10 text-yellow-700 border-yellow-200`;
    case 'LOW':
    default:
      return `${baseClass} bg-green-500/10 text-green-700 border-green-200`;
  }
}

/**
 * Get badge class for transaction status
 */
export function getStatusBadgeClass(status: string): string {
  const baseClass = 'rounded-full px-3 py-1 text-xs font-medium border';

  switch (status) {
    case 'blocked':
      return `${baseClass} bg-red-500/10 text-red-700 border-red-200`;
    case 'reviewed':
      return `${baseClass} bg-blue-500/10 text-blue-700 border-blue-200`;
    case 'approved':
      return `${baseClass} bg-green-500/10 text-green-700 border-green-200`;
    case 'pending':
    default:
      return `${baseClass} bg-gray-500/10 text-gray-700 border-gray-200`;
  }
}

/**
 * Get icon for transaction type
 */
export function getTransactionTypeIcon(type: string): string {
  switch (type) {
    case 'P2P':
      return '👤';
    case 'TRANSFER':
      return '🔄';
    case 'DEPOSIT':
      return '💰';
    case 'WITHDRAWAL':
      return '🏧';
    default:
      return '💵';
  }
}
