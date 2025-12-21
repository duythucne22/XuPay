/* ============================================
   TRANSACTIONS API - Transaction endpoints
   Layer 2: API Functions (calls client.ts)
   ============================================ */

import { paymentServiceClient } from './client'
import type {
  TransactionDTO,
  TransferRequestDTO,
  DepositRequestDTO,
  WithdrawRequestDTO,
  TransactionStatsDTO,
  PaginatedDTO,
} from '@/types/api'

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface TransactionQueryParams {
  page?: number
  size?: number
  type?: string
  status?: string
  fromDate?: string
  toDate?: string
  minAmount?: number
  maxAmount?: number
  userId?: string
  walletId?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

// ============================================
// TRANSACTIONS ENDPOINTS
// ============================================

export const transactionsApi = {
  /**
   * Get all transactions (admin only)
   * GET /api/v1/transactions
   */
  getTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<PaginatedDTO<TransactionDTO>> => {
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.set('page', String(params.page))
    if (params.size !== undefined) searchParams.set('size', String(params.size))
    if (params.type) searchParams.set('type', params.type)
    if (params.status) searchParams.set('status', params.status)
    if (params.fromDate) searchParams.set('fromDate', params.fromDate)
    if (params.toDate) searchParams.set('toDate', params.toDate)
    if (params.minAmount !== undefined) searchParams.set('minAmount', String(params.minAmount))
    if (params.maxAmount !== undefined) searchParams.set('maxAmount', String(params.maxAmount))
    if (params.userId) searchParams.set('userId', params.userId)
    if (params.walletId) searchParams.set('walletId', params.walletId)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection)

    const query = searchParams.toString()
    const path = query ? `/api/v1/transactions?${query}` : '/api/v1/transactions'
    
    return paymentServiceClient.get<PaginatedDTO<TransactionDTO>>(path)
  },

  /**
   * Get transaction by ID
   * GET /api/v1/transactions/:transactionId
   */
  getTransactionById: async (transactionId: string): Promise<TransactionDTO> => {
    return paymentServiceClient.get<TransactionDTO>(`/api/v1/transactions/${transactionId}`)
  },

  /**
   * Get transactions for current user
   * GET /api/v1/transactions/me
   */
  getMyTransactions: async (
    params: Omit<TransactionQueryParams, 'userId'> = {}
  ): Promise<PaginatedDTO<TransactionDTO>> => {
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.set('page', String(params.page))
    if (params.size !== undefined) searchParams.set('size', String(params.size))
    if (params.type) searchParams.set('type', params.type)
    if (params.status) searchParams.set('status', params.status)
    if (params.fromDate) searchParams.set('fromDate', params.fromDate)
    if (params.toDate) searchParams.set('toDate', params.toDate)

    const query = searchParams.toString()
    const path = query ? `/api/v1/transactions/me?${query}` : '/api/v1/transactions/me'
    
    return paymentServiceClient.get<PaginatedDTO<TransactionDTO>>(path)
  },

  /**
   * Get transactions for a specific wallet
   * GET /api/v1/transactions/wallet/:walletId
   */
  getWalletTransactions: async (
    walletId: string,
    params: Omit<TransactionQueryParams, 'walletId'> = {}
  ): Promise<PaginatedDTO<TransactionDTO>> => {
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.set('page', String(params.page))
    if (params.size !== undefined) searchParams.set('size', String(params.size))
    if (params.type) searchParams.set('type', params.type)
    if (params.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    const path = query
      ? `/api/v1/transactions/wallet/${walletId}?${query}`
      : `/api/v1/transactions/wallet/${walletId}`
    
    return paymentServiceClient.get<PaginatedDTO<TransactionDTO>>(path)
  },

  /**
   * Create P2P transfer
   * POST /api/v1/transactions/transfer
   */
  transfer: async (data: TransferRequestDTO): Promise<TransactionDTO> => {
    return paymentServiceClient.post<TransactionDTO>('/api/v1/transactions/transfer', data)
  },

  /**
   * Create deposit request
   * POST /api/v1/transactions/deposit
   */
  deposit: async (data: DepositRequestDTO): Promise<TransactionDTO> => {
    return paymentServiceClient.post<TransactionDTO>('/api/v1/transactions/deposit', data)
  },

  /**
   * Create withdrawal request
   * POST /api/v1/transactions/withdraw
   */
  withdraw: async (data: WithdrawRequestDTO): Promise<TransactionDTO> => {
    return paymentServiceClient.post<TransactionDTO>('/api/v1/transactions/withdraw', data)
  },

  /**
   * Get transaction statistics (admin only)
   * GET /api/v1/transactions/stats
   */
  getStats: async (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<TransactionStatsDTO> => {
    return paymentServiceClient.get<TransactionStatsDTO>(`/api/v1/transactions/stats?period=${period}`)
  },
}
