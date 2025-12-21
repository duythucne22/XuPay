/* ============================================
   TRANSACTIONS HOOKS - Transaction React Query hooks
   Layer 4: React Query (uses api/, adapters/)
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/lib/api'
import { mapTransactionDTOToTransaction, mapPaginatedTransactions } from '@/lib/adapters'
import { walletsKeys } from './useWallets'
import type { TransferRequestDTO, DepositRequestDTO, WithdrawRequestDTO } from '@/types/api'
import type { Transaction, PaginatedResponse } from '@/types'

// ============================================
// QUERY KEYS
// ============================================

export const transactionsKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...transactionsKeys.lists(), filters] as const,
  details: () => [...transactionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionsKeys.details(), id] as const,
  myTransactions: (filters: Record<string, unknown>) => [...transactionsKeys.all, 'me', filters] as const,
  walletTransactions: (walletId: string, filters: Record<string, unknown>) =>
    [...transactionsKeys.all, 'wallet', walletId, filters] as const,
  stats: (period: string) => [...transactionsKeys.all, 'stats', period] as const,
}

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface UseTransactionsParams extends Record<string, unknown> {
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
// QUERIES
// ============================================

/**
 * Hook to get paginated transactions list (admin)
 */
export function useTransactions(params: UseTransactionsParams = {}) {
  return useQuery({
    queryKey: transactionsKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Transaction>> => {
      const dto = await transactionsApi.getTransactions(params)
      return mapPaginatedTransactions(dto)
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get a single transaction by ID
 */
export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: transactionsKeys.detail(transactionId),
    queryFn: async (): Promise<Transaction> => {
      const dto = await transactionsApi.getTransactionById(transactionId)
      return mapTransactionDTOToTransaction(dto)
    },
    enabled: !!transactionId,
  })
}

/**
 * Hook to get current user's transactions
 */
export function useMyTransactions(params: Omit<UseTransactionsParams, 'userId'> = {}) {
  return useQuery({
    queryKey: transactionsKeys.myTransactions(params),
    queryFn: async (): Promise<PaginatedResponse<Transaction>> => {
      const dto = await transactionsApi.getMyTransactions(params)
      return mapPaginatedTransactions(dto)
    },
    staleTime: 30 * 1000,
  })
}

/**
 * Hook to get transactions for a specific wallet
 */
export function useWalletTransactions(
  walletId: string,
  params: Omit<UseTransactionsParams, 'walletId'> = {}
) {
  return useQuery({
    queryKey: transactionsKeys.walletTransactions(walletId, params),
    queryFn: async (): Promise<PaginatedResponse<Transaction>> => {
      const dto = await transactionsApi.getWalletTransactions(walletId, params)
      return mapPaginatedTransactions(dto)
    },
    enabled: !!walletId,
  })
}

/**
 * Hook to get transaction statistics
 */
export function useTransactionStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: transactionsKeys.stats(period),
    queryFn: () => transactionsApi.getStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook for creating a P2P transfer
 */
export function useTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransferRequestDTO) => transactionsApi.transfer(data),
    onSuccess: () => {
      // Invalidate all transaction and wallet queries
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
      queryClient.invalidateQueries({ queryKey: walletsKeys.all })
    },
  })
}

/**
 * Hook for creating a deposit
 */
export function useDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DepositRequestDTO) => transactionsApi.deposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
      queryClient.invalidateQueries({ queryKey: walletsKeys.all })
    },
  })
}

/**
 * Hook for creating a withdrawal
 */
export function useWithdraw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: WithdrawRequestDTO) => transactionsApi.withdraw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all })
      queryClient.invalidateQueries({ queryKey: walletsKeys.all })
    },
  })
}
