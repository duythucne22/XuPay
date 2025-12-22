/* ============================================
   TRANSACTIONS HOOKS (NEW) - Using paymentServiceClient
   Migrated from old lib/api approach
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPaymentServiceClient } from '@/lib/paymentServiceClient';
import type { TransferRequest, TransactionDetailResponse } from '@/lib/paymentServiceClient';
import { walletsKeys } from './useWallets.new';

// ============================================
// QUERY KEYS
// ============================================

export const transactionsKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...transactionsKeys.lists(), filters] as const,
  detail: (id: string) => [...transactionsKeys.all, 'detail', id] as const,
  byIdempotencyKey: (key: string) => [...transactionsKeys.all, 'idempotency', key] as const,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get transaction by ID
 */
export function useTransaction(transactionId: string) {
  const client = getPaymentServiceClient();

  return useQuery({
    queryKey: transactionsKeys.detail(transactionId),
    queryFn: () => client.getTransaction(transactionId),
    enabled: !!transactionId,
  });
}

/**
 * Get transaction by idempotency key
 */
export function useTransactionByIdempotencyKey(idempotencyKey: string) {
  const client = getPaymentServiceClient();

  return useQuery({
    queryKey: transactionsKeys.byIdempotencyKey(idempotencyKey),
    queryFn: () => client.getByIdempotencyKey(idempotencyKey),
    enabled: !!idempotencyKey,
  });
}

/**
 * List transactions with filters
 */
export function useTransactions(params?: { userId?: string; page?: number; size?: number }) {
  const client = getPaymentServiceClient();

  return useQuery({
    queryKey: transactionsKeys.list(params || {}),
    queryFn: () => client.listTransactions(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a transfer (P2P payment)
 */
export function useTransfer() {
  const queryClient = useQueryClient();
  const client = getPaymentServiceClient();

  return useMutation({
    mutationFn: (request: TransferRequest) => client.transfer(request),
    onSuccess: (data, variables) => {
      // Invalidate transaction lists
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      
      // Invalidate wallet balances for both sender and receiver
      queryClient.invalidateQueries({ queryKey: walletsKeys.userWallet(variables.fromUserId) });
      queryClient.invalidateQueries({ queryKey: walletsKeys.userWallet(variables.toUserId) });
      
      // Set the new transaction in cache
      queryClient.setQueryData(transactionsKeys.detail(data.transactionId), data);
    },
  });
}

// ============================================
// HELPER: Unified transaction type
// ============================================

export type Transaction = TransactionDetailResponse;
