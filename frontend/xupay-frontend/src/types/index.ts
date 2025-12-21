/* ============================================
   CORE ENTITY TYPES (UI Representation)
   These types are adapted from backend DTOs for UI consumption
   ============================================ */

// Role type for UI authorization
export type UserRole = 'user' | 'admin' | 'compliance'

// KYC Types matching backend enums
export type KycStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type KycTier = 0 | 1 | 2 | 3

// Wallet types matching backend
export type WalletType = 'personal' | 'business' | 'merchant'
export type WalletStatus = 'active' | 'frozen' | 'inactive'

// Transaction types matching backend
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'reversed'
export type TransactionType = 'transfer' | 'topup' | 'withdraw' | 'merchant_payment' | 'refund'

// Risk levels for UI display
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

// SAR types matching backend
export type SarSeverity = 'low' | 'medium' | 'high' | 'critical'
export type SarStatus = 'open' | 'under_review' | 'resolved' | 'dismissed'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string  // Computed from firstName + lastName
  phone?: string
  avatar?: string
  kycStatus: KycStatus
  kycTier: KycTier
  isActive: boolean
  isSuspended: boolean
  fraudScore: number
  role: UserRole  // Derived for UI authorization
  createdAt: Date
  lastLoginAt?: Date
}

export interface Wallet {
  id: string
  userId: string
  glAccountCode: string
  type: WalletType
  currency: string
  balance: number  // Calculated from ledger in backend, may need separate API call
  status: WalletStatus  // Derived from isActive/isFrozen
  isActive: boolean
  isFrozen: boolean
  freezeReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  idempotencyKey: string
  fromWalletId?: string
  toWalletId?: string
  fromUserId?: string
  toUserId?: string
  amount: number  // Converted from amountCents
  amountCents: number  // Original value
  currency: string
  type: TransactionType
  status: TransactionStatus
  description?: string
  referenceNumber?: string
  isFlagged: boolean
  fraudScore: number
  fraudReason?: string
  riskLevel: RiskLevel  // Derived from fraudScore
  isReversed: boolean
  reversedByTransactionId?: string
  reversalReason?: string
  createdAt: Date
  completedAt?: Date
}

export interface SAR {
  id: string
  transactionId: string
  userId: string
  severity: SarSeverity
  reason: string
  status: SarStatus
  createdAt: Date
  updatedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  filedAt?: Date
}

/* ============================================
   API RESPONSE TYPES
   ============================================ */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    timestamp: string
    requestId: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasMore: boolean
}

/* ============================================
   COMPONENT PROPS TYPES
   ============================================ */

export interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  isLoading?: boolean
}

export interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'failed' | 'active' | 'inactive'
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}