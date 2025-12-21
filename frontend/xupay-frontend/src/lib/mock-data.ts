/* ============================================
   MOCK DATA - Phase 4 Feature Pages
   Realistic test data aligned with backend DTOs
   ============================================ */

import type { User, Wallet, Transaction, SAR } from '@/types'

// ============================================
// MOCK USERS
// ============================================

export const mockCurrentUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'admin@xupay.com',
  firstName: 'Admin',
  lastName: 'User',
  fullName: 'Admin User',
  phone: '+84901234567',
  kycStatus: 'approved',
  kycTier: 3,
  role: 'admin',
  isActive: true,
  isSuspended: false,
  fraudScore: 5,
  createdAt: new Date('2024-01-15'),
  lastLoginAt: new Date(),
}

export const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    fullName: 'Alice Johnson',
    phone: '+1234567890',
    kycStatus: 'approved',
    kycTier: 2,
    role: 'user',
    isActive: true,
    isSuspended: false,
    fraudScore: 12,
    createdAt: new Date('2024-03-10'),
    lastLoginAt: new Date('2025-12-20'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
    fullName: 'Bob Smith',
    phone: '+1234567891',
    kycStatus: 'approved',
    kycTier: 2,
    role: 'user',
    isActive: true,
    isSuspended: false,
    fraudScore: 8,
    createdAt: new Date('2024-04-22'),
    lastLoginAt: new Date('2025-12-19'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'charlie@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    fullName: 'Charlie Brown',
    phone: '+1234567892',
    kycStatus: 'pending',
    kycTier: 1,
    role: 'user',
    isActive: true,
    isSuspended: false,
    fraudScore: 25,
    createdAt: new Date('2024-06-05'),
  },
]

// ============================================
// MOCK WALLETS
// ============================================

export const mockWallets: Wallet[] = [
  {
    id: '7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    glAccountCode: '2110-PERSONAL',
    type: 'personal',
    currency: 'VND',
    balance: 500000000, // 5,000,000 VND
    status: 'active',
    isActive: true,
    isFrozen: false,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '8g4f5e3d-6b7c-5d9e-0f1g-2b3c4d5e6f7g',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    glAccountCode: '2110-PERSONAL',
    type: 'personal',
    currency: 'VND',
    balance: 250000000, // 2,500,000 VND
    status: 'active',
    isActive: true,
    isFrozen: false,
    createdAt: new Date('2024-04-22'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '9h5g6f4e-7c8d-6e0f-1g2h-3c4d5e6f7g8h',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    glAccountCode: '2110-BUSINESS',
    type: 'business',
    currency: 'VND',
    balance: 1000000000, // 10,000,000 VND
    status: 'active',
    isActive: true,
    isFrozen: false,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2025-12-20'),
  },
]

// ============================================
// MOCK TRANSACTIONS
// ============================================

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    idempotencyKey: 'idem-001',
    fromWalletId: '7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f',
    toWalletId: '8g4f5e3d-6b7c-5d9e-0f1g-2b3c4d5e6f7g',
    fromUserId: '550e8400-e29b-41d4-a716-446655440001',
    toUserId: '550e8400-e29b-41d4-a716-446655440002',
    amountCents: 100000000, // 1,000,000 VND
    amount: 1000000,
    currency: 'VND',
    type: 'transfer',
    status: 'completed',
    description: 'Payment for lunch',
    isFlagged: false,
    fraudScore: 5,
    riskLevel: 'low',
    isReversed: false,
    createdAt: new Date('2025-12-20T10:30:00'),
    completedAt: new Date('2025-12-20T10:31:00'),
  },
  {
    id: 'txn-002',
    idempotencyKey: 'idem-002',
    fromWalletId: '8g4f5e3d-6b7c-5d9e-0f1g-2b3c4d5e6f7g',
    toWalletId: '7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f',
    fromUserId: '550e8400-e29b-41d4-a716-446655440002',
    toUserId: '550e8400-e29b-41d4-a716-446655440001',
    amountCents: 50000000, // 500,000 VND
    amount: 500000,
    currency: 'VND',
    type: 'transfer',
    status: 'completed',
    description: 'Reimbursement',
    isFlagged: false,
    fraudScore: 3,
    riskLevel: 'low',
    isReversed: false,
    createdAt: new Date('2025-12-20T11:15:00'),
    completedAt: new Date('2025-12-20T11:16:00'),
  },
  {
    id: 'txn-003',
    idempotencyKey: 'idem-003',
    fromWalletId: '7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f',
    toWalletId: '8g4f5e3d-6b7c-5d9e-0f1g-2b3c4d5e6f7g',
    fromUserId: '550e8400-e29b-41d4-a716-446655440001',
    toUserId: '550e8400-e29b-41d4-a716-446655440002',
    amountCents: 500000000, // 5,000,000 VND
    amount: 5000000,
    currency: 'VND',
    type: 'transfer',
    status: 'pending',
    description: 'Large transfer - pending review',
    isFlagged: true,
    fraudScore: 65,
    fraudReason: 'Unusual transaction size for user',
    riskLevel: 'high',
    isReversed: false,
    createdAt: new Date('2025-12-20T14:00:00'),
  },
  {
    id: 'txn-004',
    idempotencyKey: 'idem-004',
    fromWalletId: '8g4f5e3d-6b7c-5d9e-0f1g-2b3c4d5e6f7g',
    toWalletId: '7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f',
    fromUserId: '550e8400-e29b-41d4-a716-446655440002',
    toUserId: '550e8400-e29b-41d4-a716-446655440001',
    amountCents: 25000000, // 250,000 VND
    amount: 250000,
    currency: 'VND',
    type: 'transfer',
    status: 'failed',
    description: 'Failed transfer - insufficient balance',
    isFlagged: false,
    fraudScore: 2,
    riskLevel: 'low',
    isReversed: false,
    createdAt: new Date('2025-12-19T16:30:00'),
  },
  {
    id: 'txn-005',
    idempotencyKey: 'idem-005',
    toWalletId: '7f3e4d2c-5a6b-4c8d-9e0f-1a2b3c4d5e6f',
    toUserId: '550e8400-e29b-41d4-a716-446655440001',
    amountCents: 1000000000, // 10,000,000 VND
    amount: 10000000,
    currency: 'VND',
    type: 'topup',
    status: 'completed',
    description: 'Bank transfer topup',
    isFlagged: false,
    fraudScore: 0,
    riskLevel: 'low',
    isReversed: false,
    createdAt: new Date('2025-12-18T09:00:00'),
    completedAt: new Date('2025-12-18T09:15:00'),
  },
]

// ============================================
// MOCK SARs (Suspicious Activity Reports)
// ============================================

export const mockSARs: SAR[] = [
  {
    id: 'sar-001',
    transactionId: 'txn-003',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    severity: 'high',
    reason: 'Large transaction amount exceeds user history pattern',
    status: 'open',
    createdAt: new Date('2025-12-20T14:05:00'),
    updatedAt: new Date('2025-12-20T14:05:00'),
  },
  {
    id: 'sar-002',
    transactionId: 'txn-001',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    severity: 'low',
    reason: 'Routine peer-to-peer transfer',
    status: 'resolved',
    createdAt: new Date('2025-12-20T10:35:00'),
    updatedAt: new Date('2025-12-20T11:00:00'),
    reviewedAt: new Date('2025-12-20T11:00:00'),
    reviewedBy: 'compliance-officer-001',
  },
  {
    id: 'sar-003',
    transactionId: 'txn-005',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    severity: 'medium',
    reason: 'High frequency of deposits within short timeframe',
    status: 'under_review',
    createdAt: new Date('2025-12-18T09:30:00'),
    updatedAt: new Date('2025-12-20T08:00:00'),
    reviewedAt: new Date('2025-12-20T08:00:00'),
    reviewedBy: 'compliance-officer-001',
  },
]

// ============================================
// FORMATTING UTILITIES
// ============================================

export function formatCurrency(amountCents: number, currency: string = 'VND'): string {
  const amount = amountCents / 100
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

// ============================================
// STATUS STYLING UTILITIES
// ============================================

export function getTransactionStatusColor(status: Transaction['status']): string {
  const colors: Record<Transaction['status'], string> = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    processing: 'text-blue-600',
    failed: 'text-red-600',
    cancelled: 'text-gray-600',
    reversed: 'text-orange-600',
  }
  return colors[status]
}

export function getTransactionStatusBg(status: Transaction['status']): string {
  const colors: Record<Transaction['status'], string> = {
    completed: 'bg-green-50',
    pending: 'bg-yellow-50',
    processing: 'bg-blue-50',
    failed: 'bg-red-50',
    cancelled: 'bg-gray-50',
    reversed: 'bg-orange-50',
  }
  return colors[status]
}

export function getRiskLevelColor(level: Transaction['riskLevel']): string {
  const colors: Record<Transaction['riskLevel'], string> = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  }
  return colors[level]
}

export function getSARSeverityColor(severity: SAR['severity']): string {
  const colors: Record<SAR['severity'], string> = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  }
  return colors[severity]
}

export function getSARStatusColor(status: SAR['status']): string {
  const colors: Record<SAR['status'], string> = {
    open: 'text-red-600',
    under_review: 'text-yellow-600',
    resolved: 'text-green-600',
    dismissed: 'text-gray-600',
  }
  return colors[status]
}

// ============================================
// TRANSACTION TYPE LABELS
// ============================================

export function getTransactionTypeLabel(type: Transaction['type']): string {
  const labels: Record<Transaction['type'], string> = {
    transfer: 'Transfer',
    topup: 'Top Up',
    withdraw: 'Withdrawal',
    merchant_payment: 'Merchant Payment',
    refund: 'Refund',
  }
  return labels[type]
}

export function getWalletTypeLabel(type: Wallet['type']): string {
  const labels: Record<Wallet['type'], string> = {
    personal: 'Personal',
    business: 'Business',
    merchant: 'Merchant',
  }
  return labels[type]
}
