# 📋 TYPES DEFINITIONS - PHASE 4 UPDATE

## Update `src/types/index.ts`

```typescript
// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  kycTier: 1 | 2 | 3
  status: 'active' | 'suspended' | 'banned'
  createdAt: Date
  updatedAt?: Date
}

// Wallet Types
export interface Wallet {
  id: string
  userId: string
  name: string
  balance: number
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY'
  type: 'personal' | 'business'
  status: 'active' | 'frozen' | 'closed'
  createdAt: Date
  updatedAt?: Date
}

// Transaction Types
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type TransactionType = 'p2p' | 'internal' | 'deposit' | 'withdrawal'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Transaction {
  id: string
  fromWalletId: string
  toWalletId: string
  amount: number
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY'
  status: TransactionStatus
  transactionType: TransactionType
  description: string
  fraudScore: number // 0-100
  riskLevel: RiskLevel
  createdAt: Date
  updatedAt: Date
}

// Compliance Types
export type SARSeverity = 'low' | 'medium' | 'high' | 'critical'
export type SARStatus = 'open' | 'under_review' | 'resolved' | 'dismissed'

export interface SAR {
  id: string
  transactionId: string
  severity: SARSeverity
  reason: string
  status: SARStatus
  createdAt: Date
  reviewedAt?: Date
  resolvedAt?: Date
}

// Component Props Types
export interface KPICardProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'danger' | 'warning'
  isLoading?: boolean
}

export type StatusBadgeStatus = 'completed' | 'pending' | 'failed' | 'active' | 'inactive'

export interface StatusBadgeProps {
  status: StatusBadgeStatus
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

// Form Types
export interface TransferFormData {
  fromWalletId: string
  toWalletId: string
  amount: number
  description: string
  password: string
}

export interface ProfileFormData {
  name: string
  email: string
  phone?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// Query Hook Types
export interface UseTransactionsOptions {
  walletId?: string
  status?: TransactionStatus
  limit?: number
  offset?: number
}

export interface UseWalletsOptions {
  userId?: string
  type?: 'personal' | 'business'
}
```

---

## NEW TYPES TO ADD TO EXISTING `types/index.ts`

Copy all interfaces above and append to the end of your existing `src/types/index.ts` file. This extends the type definitions from Phase 1 to support all Phase 4 features.

**Make sure these don't conflict with existing types.**
