/* ============================================
   WALLETS HOOKS - Wallet management React Query hooks
   Layer 4: React Query (uses api/, adapters/)
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { walletsApi } from '@/lib/api'
import { mapWalletDTOToWallet, mapWalletsDTOToWallets, mapPaginatedWallets } from '@/lib/adapters'
import type { Wallet, PaginatedResponse } from '@/types'

// ============================================
// QUERY KEYS
// ============================================

export const walletsKeys = {
  all: ['wallets'] as const,
  lists: () => [...walletsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...walletsKeys.lists(), filters] as const,
  details: () => [...walletsKeys.all, 'detail'] as const,
  detail: (id: string) => [...walletsKeys.details(), id] as const,
  balance: (id: string) => [...walletsKeys.detail(id), 'balance'] as const,
  userWallets: (userId: string) => [...walletsKeys.all, 'user', userId] as const,
  myWallets: () => [...walletsKeys.all, 'me'] as const,
  platformBalance: () => [...walletsKeys.all, 'platform', 'balance'] as const,
}

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface UseWalletsParams extends Record<string, unknown> {
  page?: number
  size?: number
  userId?: string
  status?: string
  currency?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook to get paginated wallets list (admin)
 */
export function useWallets(params: UseWalletsParams = {}) {
  return useQuery({
    queryKey: walletsKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Wallet>> => {
      const dto = await walletsApi.getWallets(params)
      return mapPaginatedWallets(dto)
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get a single wallet by ID
 */
export function useWallet(walletId: string) {
  return useQuery({
    queryKey: walletsKeys.detail(walletId),
    queryFn: async (): Promise<Wallet> => {
      const dto = await walletsApi.getWalletById(walletId)
      return mapWalletDTOToWallet(dto)
    },
    enabled: !!walletId,
  })
}

/**
 * Hook to get wallets for a specific user
 */
export function useUserWallets(userId: string) {
  return useQuery({
    queryKey: walletsKeys.userWallets(userId),
    queryFn: async (): Promise<Wallet[]> => {
      const dto = await walletsApi.getWalletsByUserId(userId)
      return mapWalletsDTOToWallets(dto)
    },
    enabled: !!userId,
  })
}

/**
 * Hook to get current user's wallets
 */
export function useMyWallets() {
  return useQuery({
    queryKey: walletsKeys.myWallets(),
    queryFn: async (): Promise<Wallet[]> => {
      const dto = await walletsApi.getMyWallets()
      return mapWalletsDTOToWallets(dto)
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to get wallet balance
 */
export function useWalletBalance(walletId: string) {
  return useQuery({
    queryKey: walletsKeys.balance(walletId),
    queryFn: () => walletsApi.getWalletBalance(walletId),
    enabled: !!walletId,
    staleTime: 30 * 1000, // 30 seconds - balance changes frequently
  })
}

/**
 * Hook to get platform total balance (admin)
 */
export function usePlatformBalance() {
  return useQuery({
    queryKey: walletsKeys.platformBalance(),
    queryFn: () => walletsApi.getPlatformBalance(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook for freezing a wallet
 */
export function useFreezeWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ walletId, reason }: { walletId: string; reason: string }) =>
      walletsApi.freezeWallet(walletId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: walletsKeys.detail(variables.walletId) })
      queryClient.invalidateQueries({ queryKey: walletsKeys.lists() })
    },
  })
}

/**
 * Hook for unfreezing a wallet
 */
export function useUnfreezeWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (walletId: string) => walletsApi.unfreezeWallet(walletId),
    onSuccess: (_, walletId) => {
      queryClient.invalidateQueries({ queryKey: walletsKeys.detail(walletId) })
      queryClient.invalidateQueries({ queryKey: walletsKeys.lists() })
    },
  })
}
