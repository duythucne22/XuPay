/* ============================================
   WALLETS HOOKS (NEW) - Using paymentServiceClient
   Migrated from old lib/api approach
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPaymentServiceClient } from '@/lib/paymentServiceClient';
import type { WalletBalanceResponse, CreateWalletRequest, FreezeWalletRequest } from '@/lib/paymentServiceClient';

// ============================================
// QUERY KEYS
// ============================================

export const walletsKeys = {
  all: ['wallets'] as const,
  detail: (walletId: string) => [...walletsKeys.all, 'detail', walletId] as const,
  balance: (walletId: string) => [...walletsKeys.all, 'balance', walletId] as const,
  userWallet: (userId: string) => [...walletsKeys.all, 'user', userId] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get wallet by user ID
 */
export function useUserWallet(userId: string) {
  const client = getPaymentServiceClient();

  return useQuery({
    queryKey: walletsKeys.userWallet(userId),
    queryFn: () => client.getWalletByUserId(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Get wallet balance by wallet ID
 */
export function useWalletBalance(walletId: string) {
  const client = getPaymentServiceClient();

  return useQuery({
    queryKey: walletsKeys.balance(walletId),
    queryFn: () => client.getWalletBalance(walletId),
    enabled: !!walletId,
    staleTime: 10 * 1000, // 10 seconds - balance changes frequently
  });
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new wallet
 */
export function useCreateWallet() {
  const queryClient = useQueryClient();
  const client = getPaymentServiceClient();

  return useMutation({
    mutationFn: (request: CreateWalletRequest) => client.createWallet(request),
    onSuccess: (data) => {
      // Invalidate user wallet query
      queryClient.invalidateQueries({ queryKey: walletsKeys.userWallet(data.userId) });
      queryClient.invalidateQueries({ queryKey: walletsKeys.all });
    },
  });
}

/**
 * Freeze or unfreeze a wallet
 */
export function useFreezeWallet() {
  const queryClient = useQueryClient();
  const client = getPaymentServiceClient();

  return useMutation({
    mutationFn: ({ walletId, request }: { walletId: string; request: FreezeWalletRequest }) =>
      client.freezeWallet(walletId, request),
    onSuccess: (_, variables) => {
      // Invalidate specific wallet queries
      queryClient.invalidateQueries({ queryKey: walletsKeys.detail(variables.walletId) });
      queryClient.invalidateQueries({ queryKey: walletsKeys.balance(variables.walletId) });
    },
  });
}

// ============================================
// HELPER: Unified wallet response type
// ============================================

export type Wallet = WalletBalanceResponse;
