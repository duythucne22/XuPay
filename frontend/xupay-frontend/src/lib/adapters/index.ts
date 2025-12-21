/* ============================================
   ADAPTERS - DTO to UI Type Transformations
   Layer 4: Mappers (uses types/api.ts → types/index.ts)
   ============================================ */

import type {
  UserDTO,
  WalletDTO,
  TransactionDTO,
  SARDTO,
  PaginatedDTO,
  KycStatus as ApiKycStatus,
  KycTier as ApiKycTier,
  TransactionType as ApiTransactionType,
  TransactionStatus as ApiTransactionStatus,
  WalletType as ApiWalletType,
  SarSeverity as ApiSarSeverity,
  SarStatus as ApiSarStatus,
} from '@/types/api'

import type {
  User,
  Wallet,
  Transaction,
  SAR,
  PaginatedResponse,
  KycStatus,
  KycTier,
  TransactionType,
  TransactionStatus,
  WalletType,
  WalletStatus,
  RiskLevel,
  SarSeverity,
  SarStatus,
  UserRole,
} from '@/types'

// ============================================
// HELPER FUNCTIONS
// ============================================

function mapApiKycStatusToUI(status: ApiKycStatus): KycStatus {
  const map: Record<ApiKycStatus, KycStatus> = {
    'PENDING': 'pending',
    'APPROVED': 'approved',
    'REJECTED': 'rejected',
    'EXPIRED': 'expired',
  }
  return map[status]
}

function mapApiKycTierToUI(tier: ApiKycTier): KycTier {
  const map: Record<ApiKycTier, KycTier> = {
    'TIER_0': 0,
    'TIER_1': 1,
    'TIER_2': 2,
    'TIER_3': 3,
  }
  return map[tier]
}

function mapApiWalletTypeToUI(type: ApiWalletType): WalletType {
  const map: Record<ApiWalletType, WalletType> = {
    'PERSONAL': 'personal',
    'BUSINESS': 'business',
    'MERCHANT': 'merchant',
  }
  return map[type]
}

function mapApiTransactionTypeToUI(type: ApiTransactionType): TransactionType {
  const map: Record<ApiTransactionType, TransactionType> = {
    'TRANSFER': 'transfer',
    'TOPUP': 'topup',
    'WITHDRAW': 'withdraw',
    'MERCHANT_PAYMENT': 'merchant_payment',
    'REFUND': 'refund',
  }
  return map[type]
}

function mapApiTransactionStatusToUI(status: ApiTransactionStatus): TransactionStatus {
  const map: Record<ApiTransactionStatus, TransactionStatus> = {
    'PENDING': 'pending',
    'PROCESSING': 'processing',
    'COMPLETED': 'completed',
    'FAILED': 'failed',
    'CANCELLED': 'cancelled',
    'REVERSED': 'reversed',
  }
  return map[status]
}

function mapApiSarSeverityToUI(severity: ApiSarSeverity): SarSeverity {
  const map: Record<ApiSarSeverity, SarSeverity> = {
    'LOW': 'low',
    'MEDIUM': 'medium',
    'HIGH': 'high',
    'CRITICAL': 'critical',
  }
  return map[severity]
}

function mapApiSarStatusToUI(status: ApiSarStatus): SarStatus {
  const map: Record<ApiSarStatus, SarStatus> = {
    'OPEN': 'open',
    'UNDER_REVIEW': 'under_review',
    'RESOLVED': 'resolved',
    'DISMISSED': 'dismissed',
  }
  return map[status]
}

function deriveWalletStatus(isActive: boolean, isFrozen: boolean): WalletStatus {
  if (isFrozen) return 'frozen'
  if (!isActive) return 'inactive'
  return 'active'
}

function deriveRiskLevel(fraudScore: number | undefined): RiskLevel {
  if (!fraudScore || fraudScore < 25) return 'low'
  if (fraudScore < 50) return 'medium'
  if (fraudScore < 75) return 'high'
  return 'critical'
}

function deriveUserRole(isActive: boolean): UserRole {
  // Default to 'user' - actual role would come from backend
  // This is a placeholder - real implementation would check user permissions
  return 'user'
}

// ============================================
// USER ADAPTER
// ============================================

export function mapUserDTOToUser(dto: UserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.firstName} ${dto.lastName}`.trim(),
    phone: dto.phone,
    avatar: undefined, // Not in backend, could be added via profile service
    kycStatus: mapApiKycStatusToUI(dto.kycStatus),
    kycTier: mapApiKycTierToUI(dto.kycTier),
    isActive: dto.isActive,
    isSuspended: dto.isSuspended,
    fraudScore: dto.fraudScore,
    role: deriveUserRole(dto.isActive),
    createdAt: new Date(dto.createdAt),
    lastLoginAt: dto.lastLoginAt ? new Date(dto.lastLoginAt) : undefined,
  }
}

export function mapUsersDTOToUsers(dtos: UserDTO[]): User[] {
  return dtos.map(mapUserDTOToUser)
}

// ============================================
// WALLET ADAPTER
// ============================================

export function mapWalletDTOToWallet(dto: WalletDTO, balanceCents?: number): Wallet {
  return {
    id: dto.id,
    userId: dto.userId,
    glAccountCode: dto.glAccountCode,
    type: mapApiWalletTypeToUI(dto.walletType),
    currency: dto.currency,
    balance: balanceCents ? balanceCents / 100 : 0, // Balance comes from separate API
    status: deriveWalletStatus(dto.isActive, dto.isFrozen),
    isActive: dto.isActive,
    isFrozen: dto.isFrozen,
    freezeReason: dto.freezeReason,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  }
}

export function mapWalletsDTOToWallets(dtos: WalletDTO[]): Wallet[] {
  return dtos.map((dto) => mapWalletDTOToWallet(dto))
}

// ============================================
// TRANSACTION ADAPTER
// ============================================

export function mapTransactionDTOToTransaction(dto: TransactionDTO): Transaction {
  return {
    id: dto.id,
    idempotencyKey: dto.idempotencyKey,
    fromWalletId: dto.fromWalletId,
    toWalletId: dto.toWalletId,
    fromUserId: dto.fromUserId,
    toUserId: dto.toUserId,
    amount: dto.amountCents / 100,
    amountCents: dto.amountCents,
    currency: dto.currency,
    type: mapApiTransactionTypeToUI(dto.type),
    status: mapApiTransactionStatusToUI(dto.status),
    description: dto.description,
    referenceNumber: dto.referenceNumber,
    isFlagged: dto.isFlagged,
    fraudScore: dto.fraudScore ?? 0,
    fraudReason: dto.fraudReason,
    riskLevel: deriveRiskLevel(dto.fraudScore),
    isReversed: dto.isReversed,
    createdAt: new Date(dto.createdAt),
    completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
  }
}

export function mapTransactionsDTOToTransactions(dtos: TransactionDTO[]): Transaction[] {
  return dtos.map(mapTransactionDTOToTransaction)
}

// ============================================
// SAR ADAPTER
// ============================================

export function mapSarDTOToSar(dto: SARDTO): SAR {
  return {
    id: dto.id,
    transactionId: dto.transactionId,
    userId: dto.userId,
    severity: mapApiSarSeverityToUI(dto.severity),
    reason: dto.reason,
    status: mapApiSarStatusToUI(dto.status),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    reviewedAt: dto.reviewedAt ? new Date(dto.reviewedAt) : undefined,
    reviewedBy: dto.reviewedBy,
    filedAt: dto.filedAt ? new Date(dto.filedAt) : undefined,
  }
}

export function mapSarsDTOToSars(dtos: SARDTO[]): SAR[] {
  return dtos.map(mapSarDTOToSar)
}

// ============================================
// PAGINATION ADAPTER
// ============================================

export function mapPaginatedDTO<TDto, TEntity>(
  dto: PaginatedDTO<TDto>,
  mapper: (item: TDto) => TEntity
): PaginatedResponse<TEntity> {
  return {
    items: dto.content.map(mapper),
    total: dto.totalElements,
    page: dto.page,
    perPage: dto.size,
    totalPages: dto.totalPages,
    hasMore: !dto.last,
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export function mapPaginatedUsers(dto: PaginatedDTO<UserDTO>): PaginatedResponse<User> {
  return mapPaginatedDTO(dto, mapUserDTOToUser)
}

export function mapPaginatedWallets(dto: PaginatedDTO<WalletDTO>): PaginatedResponse<Wallet> {
  return mapPaginatedDTO(dto, mapWalletDTOToWallet)
}

export function mapPaginatedTransactions(dto: PaginatedDTO<TransactionDTO>): PaginatedResponse<Transaction> {
  return mapPaginatedDTO(dto, mapTransactionDTOToTransaction)
}

export function mapPaginatedSars(dto: PaginatedDTO<SARDTO>): PaginatedResponse<SAR> {
  return mapPaginatedDTO(dto, mapSarDTOToSar)
}
