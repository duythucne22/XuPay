/**
 * Mock Fraud Data
 * Used for development and testing before backend APIs are ready
 */

import {
  FraudMetrics,
  FlaggedTransaction,
  FraudTrend,
  FraudHeatmapData,
  FraudRule,
  RiskBreakdown,
  RiskHistoryEvent,
} from '@/types/fraud';

/**
 * Mock fraud metrics
 */
export const MOCK_FRAUD_METRICS: FraudMetrics = {
  totalFlagged: 47,
  flaggedAmount: 28500.5,
  flaggedPercent: 2.3,
  riskDistribution: {
    LOW: 20,
    MEDIUM: 15,
    HIGH: 10,
    CRITICAL: 2,
  },
  timestamp: new Date(),
};

/**
 * Mock flagged transactions list
 */
export const MOCK_FLAGGED_TRANSACTIONS: FlaggedTransaction[] = [
  {
    id: 'fraud_001',
    transactionId: 'txn_abc123',
    amount: 5000,
    type: 'TRANSFER',
    fraudScore: 85,
    riskLevel: 'HIGH',
    flagged: true,
    reason: 'Unusual time + high amount + new wallet',
    createdAt: new Date('2025-12-22T14:30:00Z'),
    status: 'pending',
    fromUser: { id: 'user_001', name: 'John Doe', email: 'john@example.com' },
    toUser: { id: 'user_002', name: 'Jane Smith', email: 'jane@example.com' },
    wallet: { id: 'wal_001', name: 'Main Wallet', type: 'PERSONAL' },
  },
  {
    id: 'fraud_002',
    transactionId: 'txn_def456',
    amount: 12500,
    type: 'TRANSFER',
    fraudScore: 72,
    riskLevel: 'HIGH',
    flagged: true,
    reason: 'Amount exceeds daily limit',
    createdAt: new Date('2025-12-21T10:15:00Z'),
    status: 'reviewed',
    fromUser: { id: 'user_003', name: 'Alice Johnson', email: 'alice@example.com' },
    toUser: { id: 'user_004', name: 'Bob Wilson', email: 'bob@example.com' },
    wallet: { id: 'wal_002', name: 'Business Account', type: 'MERCHANT' },
  },
  {
    id: 'fraud_003',
    transactionId: 'txn_ghi789',
    amount: 950,
    type: 'P2P',
    fraudScore: 45,
    riskLevel: 'MEDIUM',
    flagged: true,
    reason: 'Velocity check - 3 transactions in 10 minutes',
    createdAt: new Date('2025-12-21T09:45:00Z'),
    status: 'pending',
    fromUser: { id: 'user_005', name: 'Charlie Brown', email: 'charlie@example.com' },
    toUser: { id: 'user_006', name: 'Diana Prince', email: 'diana@example.com' },
    wallet: { id: 'wal_003', name: 'Savings Account', type: 'PERSONAL' },
  },
  {
    id: 'fraud_004',
    transactionId: 'txn_jkl012',
    amount: 8200,
    type: 'WITHDRAWAL',
    fraudScore: 92,
    riskLevel: 'CRITICAL',
    flagged: true,
    reason: 'High-risk country + unusual device + new destination',
    createdAt: new Date('2025-12-20T16:20:00Z'),
    status: 'blocked',
    fromUser: { id: 'user_007', name: 'Eve Davis', email: 'eve@example.com' },
    wallet: { id: 'wal_004', name: 'Travel Wallet', type: 'PERSONAL' },
  },
  {
    id: 'fraud_005',
    transactionId: 'txn_mno345',
    amount: 3400,
    type: 'DEPOSIT',
    fraudScore: 38,
    riskLevel: 'MEDIUM',
    flagged: true,
    reason: 'Source verification pending',
    createdAt: new Date('2025-12-20T11:05:00Z'),
    status: 'pending',
    fromUser: { id: 'user_008', name: 'Frank Miller', email: 'frank@example.com' },
    wallet: { id: 'wal_001', name: 'Main Wallet', type: 'PERSONAL' },
  },
  {
    id: 'fraud_006',
    transactionId: 'txn_pqr678',
    amount: 6750,
    type: 'TRANSFER',
    fraudScore: 68,
    riskLevel: 'HIGH',
    flagged: true,
    reason: 'Multiple flags: velocity + amount + new recipient',
    createdAt: new Date('2025-12-19T13:30:00Z'),
    status: 'reviewed',
    fromUser: { id: 'user_009', name: 'Grace Lee', email: 'grace@example.com' },
    toUser: { id: 'user_010', name: 'Henry Cole', email: 'henry@example.com' },
    wallet: { id: 'wal_002', name: 'Business Account', type: 'MERCHANT' },
  },
  {
    id: 'fraud_007',
    transactionId: 'txn_stu901',
    amount: 2100,
    type: 'P2P',
    fraudScore: 52,
    riskLevel: 'MEDIUM',
    flagged: true,
    reason: 'Device fingerprint mismatch',
    createdAt: new Date('2025-12-19T08:45:00Z'),
    status: 'pending',
    fromUser: { id: 'user_011', name: 'Iris Martin', email: 'iris@example.com' },
    toUser: { id: 'user_012', name: 'Jack Taylor', email: 'jack@example.com' },
    wallet: { id: 'wal_003', name: 'Savings Account', type: 'PERSONAL' },
  },
  {
    id: 'fraud_008',
    transactionId: 'txn_vwx234',
    amount: 11200,
    type: 'WITHDRAWAL',
    fraudScore: 78,
    riskLevel: 'HIGH',
    flagged: true,
    reason: 'High amount + new bank account',
    createdAt: new Date('2025-12-18T15:20:00Z'),
    status: 'blocked',
    fromUser: { id: 'user_013', name: 'Kate White', email: 'kate@example.com' },
    wallet: { id: 'wal_004', name: 'Travel Wallet', type: 'PERSONAL' },
  },
];

/**
 * Mock fraud trends (30 days)
 */
export const MOCK_FRAUD_TRENDS: FraudTrend[] = [
  { date: '2025-11-23', count: 5, amount: 3000, severity: 'LOW' },
  { date: '2025-11-24', count: 8, amount: 5200, severity: 'MEDIUM' },
  { date: '2025-11-25', count: 6, amount: 3800, severity: 'LOW' },
  { date: '2025-11-26', count: 12, amount: 8900, severity: 'MEDIUM' },
  { date: '2025-11-27', count: 9, amount: 6200, severity: 'MEDIUM' },
  { date: '2025-11-28', count: 4, amount: 2100, severity: 'LOW' },
  { date: '2025-11-29', count: 15, amount: 11500, severity: 'HIGH' },
  { date: '2025-11-30', count: 7, amount: 4300, severity: 'LOW' },
  { date: '2025-12-01', count: 10, amount: 7600, severity: 'MEDIUM' },
  { date: '2025-12-02', count: 11, amount: 8400, severity: 'MEDIUM' },
  { date: '2025-12-03', count: 6, amount: 3200, severity: 'LOW' },
  { date: '2025-12-04', count: 13, amount: 9800, severity: 'HIGH' },
  { date: '2025-12-05', count: 8, amount: 5100, severity: 'MEDIUM' },
  { date: '2025-12-06', count: 9, amount: 6700, severity: 'MEDIUM' },
  { date: '2025-12-07', count: 5, amount: 2800, severity: 'LOW' },
  { date: '2025-12-08', count: 14, amount: 10200, severity: 'HIGH' },
  { date: '2025-12-09', count: 7, amount: 4500, severity: 'LOW' },
  { date: '2025-12-10', count: 10, amount: 7300, severity: 'MEDIUM' },
  { date: '2025-12-11', count: 12, amount: 8900, severity: 'MEDIUM' },
  { date: '2025-12-12', count: 6, amount: 3600, severity: 'LOW' },
  { date: '2025-12-13', count: 16, amount: 12100, severity: 'HIGH' },
  { date: '2025-12-14', count: 9, amount: 5800, severity: 'MEDIUM' },
  { date: '2025-12-15', count: 8, amount: 6200, severity: 'MEDIUM' },
  { date: '2025-12-16', count: 4, amount: 2000, severity: 'LOW' },
  { date: '2025-12-17', count: 11, amount: 8300, severity: 'MEDIUM' },
  { date: '2025-12-18', count: 7, amount: 4700, severity: 'LOW' },
  { date: '2025-12-19', count: 13, amount: 9600, severity: 'MEDIUM' },
  { date: '2025-12-20', count: 9, amount: 6500, severity: 'MEDIUM' },
  { date: '2025-12-21', count: 10, amount: 7800, severity: 'MEDIUM' },
  { date: '2025-12-22', count: 8, amount: 5000, severity: 'LOW' },
];

/**
 * Mock fraud heatmap data by transaction type
 */
export const MOCK_FRAUD_HEATMAP_BY_TYPE: FraudHeatmapData[] = [
  { category: 'TRANSFER', flaggedCount: 18, totalCount: 450, flagRate: 0.04 },
  { category: 'P2P', flaggedCount: 12, totalCount: 320, flagRate: 0.0375 },
  { category: 'WITHDRAWAL', flaggedCount: 10, totalCount: 280, flagRate: 0.036 },
  { category: 'DEPOSIT', flaggedCount: 7, totalCount: 350, flagRate: 0.02 },
];

/**
 * Mock fraud heatmap data by wallet type
 */
export const MOCK_FRAUD_HEATMAP_BY_WALLET: FraudHeatmapData[] = [
  { category: 'PERSONAL', flaggedCount: 25, totalCount: 800, flagRate: 0.03125 },
  { category: 'MERCHANT', flaggedCount: 15, totalCount: 400, flagRate: 0.0375 },
  { category: 'ESCROW', flaggedCount: 7, totalCount: 200, flagRate: 0.035 },
];

/**
 * Mock fraud detection rules
 */
export const MOCK_FRAUD_RULES: FraudRule[] = [
  {
    id: 'rule_001',
    name: 'High Amount Transfer',
    description: 'Flags transfers over $10,000',
    condition: 'amount > 10000 AND type = TRANSFER',
    threshold: 10000,
    action: 'FLAG',
    enabled: true,
    accuracy: 0.87,
    falsePositiveRate: 0.12,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'rule_002',
    name: 'Velocity Check',
    description: 'Flags 3+ transactions in 10 minutes',
    condition: 'velocity_count >= 3 AND time_window = 10min',
    threshold: 3,
    action: 'REVIEW',
    enabled: true,
    accuracy: 0.92,
    falsePositiveRate: 0.08,
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'rule_003',
    name: 'Unusual Geographic Location',
    description: 'Flags transactions from high-risk countries',
    condition: 'country IN (high_risk_list)',
    threshold: 1,
    action: 'BLOCK',
    enabled: true,
    accuracy: 0.94,
    falsePositiveRate: 0.06,
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'rule_004',
    name: 'New Recipient Flag',
    description: 'Flags transfers to new/unverified recipients',
    condition: 'recipient_new = true OR recipient_verified = false',
    threshold: 1,
    action: 'REVIEW',
    enabled: true,
    accuracy: 0.85,
    falsePositiveRate: 0.15,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'rule_005',
    name: 'Unusual Device',
    description: 'Flags transactions from new/unusual devices',
    condition: 'device_new = true OR device_risk_score > 70',
    threshold: 1,
    action: 'REVIEW',
    enabled: true,
    accuracy: 0.88,
    falsePositiveRate: 0.1,
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 'rule_006',
    name: 'Daily Limit Exceeded',
    description: 'Flags when daily transaction limit exceeded',
    condition: 'daily_amount > daily_limit',
    threshold: 1,
    action: 'FLAG',
    enabled: true,
    accuracy: 0.96,
    falsePositiveRate: 0.04,
    createdAt: new Date('2025-01-25'),
  },
  {
    id: 'rule_007',
    name: 'Large Round Amount',
    description: 'Flags suspiciously round large amounts',
    condition: 'amount > 5000 AND (amount % 1000 = 0)',
    threshold: 1,
    action: 'FLAG',
    enabled: false,
    accuracy: 0.72,
    falsePositiveRate: 0.25,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'rule_008',
    name: 'Source Verification',
    description: 'Flags deposits from unverified sources',
    condition: 'type = DEPOSIT AND source_verified = false',
    threshold: 1,
    action: 'REVIEW',
    enabled: true,
    accuracy: 0.89,
    falsePositiveRate: 0.09,
    createdAt: new Date('2025-02-05'),
  },
];

/**
 * Mock risk breakdown for transaction detail
 */
export const MOCK_RISK_BREAKDOWN: RiskBreakdown = {
  transactionId: 'txn_abc123',
  fraudScore: 85,
  triggeredRules: [
    {
      ruleId: 'rule_001',
      ruleName: 'High Amount Transfer',
      reason: 'Transaction amount ($5,000) is significant',
      score: 25,
    },
    {
      ruleId: 'rule_003',
      ruleName: 'Unusual Time',
      reason: 'Transaction at 2:30 AM (unusual for this user)',
      score: 30,
    },
    {
      ruleId: 'rule_004',
      ruleName: 'New Recipient',
      reason: 'Recipient account created 3 days ago',
      score: 20,
    },
    {
      ruleId: 'rule_005',
      ruleName: 'New Device',
      reason: 'Transaction from new iPhone 15',
      score: 10,
    },
  ],
  mlPrediction: {
    probability: 0.78,
    confidence: 0.91,
    model: 'fraud_detection_v2',
  },
};

/**
 * Mock risk history
 */
export const MOCK_RISK_HISTORY: RiskHistoryEvent[] = [
  {
    id: 'risk_001',
    transactionId: 'txn_abc123',
    riskLevel: 'HIGH',
    reason: 'Multiple fraud rule violations detected',
    score: 85,
    timestamp: new Date('2025-12-22T14:30:00Z'),
    resolved: false,
  },
  {
    id: 'risk_002',
    transactionId: 'txn_def456',
    riskLevel: 'HIGH',
    reason: 'Amount exceeds daily limit',
    score: 72,
    timestamp: new Date('2025-12-21T10:15:00Z'),
    resolved: true,
    resolvedAt: new Date('2025-12-21T11:00:00Z'),
  },
  {
    id: 'risk_003',
    userId: 'user_001',
    riskLevel: 'MEDIUM',
    reason: 'Account shows suspicious activity pattern',
    score: 55,
    timestamp: new Date('2025-12-20T09:00:00Z'),
    resolved: true,
    resolvedAt: new Date('2025-12-20T16:30:00Z'),
  },
];

/**
 * Helper function to generate paginated fraud transactions
 */
export function generatePaginatedTransactions(offset = 0, limit = 50) {
  return {
    data: MOCK_FLAGGED_TRANSACTIONS.slice(offset, offset + limit),
    total: MOCK_FLAGGED_TRANSACTIONS.length,
    offset,
    limit,
  };
}

/**
 * Helper function to generate fraud data with custom date range
 */
export function generateFraudTrends(daysBack = 30) {
  const today = new Date();
  const trends = [];

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    trends.push({
      date: dateStr,
      count: Math.floor(Math.random() * 20) + 4,
      amount: Math.floor(Math.random() * 10000) + 2000,
      severity: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as 'LOW' | 'MEDIUM' | 'HIGH',
    });
  }

  return trends;
}
