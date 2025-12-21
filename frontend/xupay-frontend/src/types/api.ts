/* ============================================
   API TYPES - Backend DTOs
   These types match the Java backend responses exactly
   ============================================ */

// ============================================
// ENUMS (matching Java enums)
// ============================================

export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
export type KycTier = 'TIER_0' | 'TIER_1' | 'TIER_2' | 'TIER_3'
export type WalletType = 'PERSONAL' | 'BUSINESS' | 'MERCHANT'
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED'
export type TransactionType = 'TRANSFER' | 'TOPUP' | 'WITHDRAW' | 'MERCHANT_PAYMENT' | 'REFUND'

// ============================================
// AUTH & SESSION TYPES
// ============================================

export interface AuthTokensDTO {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface LoginRequestDTO {
  email: string
  password: string
}

export interface RegisterRequestDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface RefreshTokenRequestDTO {
  refreshToken: string
}

export interface ChangePasswordRequestDTO {
  currentPassword: string
  newPassword: string
}

// ============================================
// USER TYPES (From User Service)
// ============================================

export interface UserDTO {
  id: string
  email: string
  phone?: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  nationality?: string
  kycStatus: KycStatus
  kycTier: KycTier
  kycVerifiedAt?: string
  isActive: boolean
  isSuspended: boolean
  suspensionReason?: string
  fraudScore: number
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface SessionDTO {
  id: string
  userId: string
  ipAddress: string
  userAgent: string
  createdAt: string
  expiresAt: string
  isActive: boolean
}

export interface UpdateUserRequestDTO {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  nationality?: string
}

export interface UpdateKycRequestDTO {
  kycStatus: KycStatus
  kycTier: KycTier
}

// ============================================
// WALLET TYPES (From Payment Service)
// ============================================

export interface WalletDTO {
  id: string
  userId: string
  glAccountCode: string
  walletType: WalletType
  currency: string
  isActive: boolean
  isFrozen: boolean
  freezeReason?: string
  createdAt: string
  updatedAt: string
}

export interface WalletBalanceDTO {
  walletId: string
  userId: string
  balanceCents: number
  currency: string
  lastUpdated: string
}

export interface CreateWalletRequestDTO {
  userId: string
  walletType: WalletType
}

// ============================================
// TRANSACTION TYPES (From Payment Service)
// ============================================

export interface TransactionDTO {
  id: string
  idempotencyKey: string
  fromWalletId?: string
  toWalletId?: string
  fromUserId?: string
  toUserId?: string
  amountCents: number
  currency: string
  type: TransactionType
  status: TransactionStatus
  description?: string
  referenceNumber?: string
  isFlagged: boolean
  fraudScore?: number
  fraudReason?: string
  ipAddress?: string
  isReversed: boolean
  reversedByTransactionId?: string
  reversalReason?: string
  createdAt: string
  completedAt?: string
}

export interface TransferRequestDTO {
  idempotencyKey: string
  fromUserId: string
  toUserId: string
  amountCents: number
  description?: string
}

export interface DepositRequestDTO {
  idempotencyKey: string
  userId: string
  amountCents: number
  description?: string
}

export interface WithdrawRequestDTO {
  idempotencyKey: string
  userId: string
  amountCents: number
  description?: string
}

export interface TransferResponseDTO {
  transactionId: string
  fromUserId: string
  fromWalletId: string
  toUserId: string
  toWalletId: string
  amountCents: number
  status: TransactionStatus
  fraudScore: number
  isFlagged: boolean
  createdAt: string
}

export interface TransactionStatsDTO {
  totalTransactions: number
  totalVolumeCents: number
  completedCount: number
  pendingCount: number
  failedCount: number
  byType: Record<TransactionType, number>
  period: string
}

// ============================================
// SAR / COMPLIANCE TYPES
// ============================================

export type SarSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type SarStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'

export interface SARDTO {
  id: string
  transactionId: string
  userId: string
  severity: SarSeverity
  reason: string
  status: SarStatus
  createdAt: string
  updatedAt: string
  reviewedAt?: string
  reviewedBy?: string
  filedAt?: string
}

export interface CreateSarRequestDTO {
  transactionId: string
  userId: string
  severity: SarSeverity
  reason: string
}

export interface UpdateSarRequestDTO {
  severity?: SarSeverity
  reason?: string
  status?: SarStatus
}

// ============================================
// PAGINATION & ERROR TYPES
// ============================================

export interface PaginatedDTO<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  first: boolean
  last: boolean
}

export interface ApiErrorDTO {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  details?: Array<{
    field: string
    message: string
  }>
}

// ============================================
// HEALTH CHECK
// ============================================

export interface HealthCheckDTO {
  status: 'UP' | 'DOWN'
  components?: Record<string, { status: string }>
}
