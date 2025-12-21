/* ============================================
   WALLETS API - Wallet management endpoints
   Layer 2: API Functions (calls client.ts)
   ============================================ */

import { paymentServiceClient } from './client'
import type {
  WalletDTO,
  WalletBalanceDTO,
  PaginatedDTO,
} from '@/types/api'

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface WalletQueryParams {
  page?: number
  size?: number
  userId?: string
  status?: string
  currency?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

// ============================================
// WALLETS ENDPOINTS
// ============================================

export const walletsApi = {
  /**
   * Get all wallets (admin only)
   * GET /api/v1/wallets
   */
  getWallets: async (params: WalletQueryParams = {}): Promise<PaginatedDTO<WalletDTO>> => {
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.set('page', String(params.page))
    if (params.size !== undefined) searchParams.set('size', String(params.size))
    if (params.userId) searchParams.set('userId', params.userId)
    if (params.status) searchParams.set('status', params.status)
    if (params.currency) searchParams.set('currency', params.currency)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection)

    const query = searchParams.toString()
    const path = query ? `/api/v1/wallets?${query}` : '/api/v1/wallets'
    
    return paymentServiceClient.get<PaginatedDTO<WalletDTO>>(path)
  },

  /**
   * Get wallet by ID
   * GET /api/v1/wallets/:walletId
   */
  getWalletById: async (walletId: string): Promise<WalletDTO> => {
    return paymentServiceClient.get<WalletDTO>(`/api/v1/wallets/${walletId}`)
  },

  /**
   * Get wallets for a specific user
   * GET /api/v1/wallets/user/:userId
   */
  getWalletsByUserId: async (userId: string): Promise<WalletDTO[]> => {
    return paymentServiceClient.get<WalletDTO[]>(`/api/v1/wallets/user/${userId}`)
  },

  /**
   * Get current user's wallets
   * GET /api/v1/wallets/me
   */
  getMyWallets: async (): Promise<WalletDTO[]> => {
    return paymentServiceClient.get<WalletDTO[]>('/api/v1/wallets/me')
  },

  /**
   * Get wallet balance
   * GET /api/v1/wallets/:walletId/balance
   */
  getWalletBalance: async (walletId: string): Promise<WalletBalanceDTO> => {
    return paymentServiceClient.get<WalletBalanceDTO>(`/api/v1/wallets/${walletId}/balance`)
  },

  /**
   * Freeze wallet (admin only)
   * POST /api/v1/wallets/:walletId/freeze
   */
  freezeWallet: async (walletId: string, reason: string): Promise<WalletDTO> => {
    return paymentServiceClient.post<WalletDTO>(`/api/v1/wallets/${walletId}/freeze`, { reason })
  },

  /**
   * Unfreeze wallet (admin only)
   * POST /api/v1/wallets/:walletId/unfreeze
   */
  unfreezeWallet: async (walletId: string): Promise<WalletDTO> => {
    return paymentServiceClient.post<WalletDTO>(`/api/v1/wallets/${walletId}/unfreeze`)
  },

  /**
   * Get total platform balance (admin only)
   * GET /api/v1/wallets/platform/balance
   */
  getPlatformBalance: async (): Promise<{ totalBalance: number; currency: string }> => {
    return paymentServiceClient.get('/api/v1/wallets/platform/balance')
  },
}
