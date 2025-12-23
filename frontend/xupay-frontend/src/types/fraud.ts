/**
 * Fraud Detection & Risk Management Types
 * Used across fraud dashboard, flagged transactions, and risk analysis
 */

/**
 * Fraud Risk Levels
 */
export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Actions for fraud transactions
 */
export type FraudAction = 'approve' | 'block' | 'review';

/**
 * Transaction types for fraud categorization
 */
export type TransactionType = 'P2P' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';

/**
 * Fraud metrics summary
 * Displayed on fraud dashboard as KPI cards
 */
export interface FraudMetrics {
  totalFlagged: number;
  flaggedAmount: number;
  flaggedPercent: number;
  riskDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  timestamp: Date;
}

/**
 * Individual flagged transaction
 * Used in flagged transactions list/table
 */
export interface FlaggedTransaction {
  id: string;
  transactionId: string;
  amount: number;
  type: TransactionType;
  fraudScore: number; // 0-100
  riskLevel: FraudRiskLevel;
  flagged: boolean;
  reason?: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'blocked';
  
  // Enhanced details
  fromUser?: {
    id: string;
    name: string;
    email: string;
  };
  toUser?: {
    id: string;
    name: string;
    email: string;
  };
  wallet?: {
    id: string;
    name: string;
    type: string;
  };
}

/**
 * Daily fraud trend data
 * Used in trend charts
 */
export interface FraudTrend {
  date: string; // YYYY-MM-DD
  count: number;
  amount: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Fraud heatmap data
 * Shows fraud distribution by category
 */
export interface FraudHeatmapData {
  category: string;
  flaggedCount: number;
  totalCount: number;
  flagRate: number; // 0-1
}

/**
 * Fraud detection rule
 * Used in fraud rules management page
 */
export interface FraudRule {
  id: string;
  name: string;
  description: string;
  condition: string; // e.g., "amount > 10000 AND type = TRANSFER"
  threshold: number;
  action: string; // e.g., "FLAG", "BLOCK", "REVIEW"
  enabled: boolean;
  accuracy: number; // 0-1
  falsePositiveRate: number; // 0-1
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Risk breakdown for transaction detail view
 * Shows which rules triggered for this transaction
 */
export interface RiskBreakdown {
  transactionId: string;
  fraudScore: number;
  triggeredRules: {
    ruleId: string;
    ruleName: string;
    reason: string;
    score: number;
  }[];
  mlPrediction?: {
    probability: number; // 0-1
    confidence: number; // 0-1
    model: string;
  };
}

/**
 * Risk history event
 * Tracks historical risks for a user/transaction
 */
export interface RiskHistoryEvent {
  id: string;
  transactionId?: string;
  userId?: string;
  riskLevel: FraudRiskLevel;
  reason: string;
  score: number;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Fraud filters for querying transactions
 */
export interface FraudFilters {
  offset?: number;
  limit?: number;
  status?: 'pending' | 'reviewed' | 'approved' | 'blocked';
  riskLevel?: FraudRiskLevel;
  dateRange?: string; // e.g., "7d", "30d", "custom"
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  type?: TransactionType;
  search?: string;
}

/**
 * Fraud dashboard data (combined view)
 */
export interface FraudDashboardData {
  metrics: FraudMetrics;
  flaggedTransactions: FlaggedTransaction[];
  trends: FraudTrend[];
  heatmapData: FraudHeatmapData[];
  rules: FraudRule[];
}
