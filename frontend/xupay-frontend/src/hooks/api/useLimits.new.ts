/* ============================================
   LIMITS HOOKS (NEW) - Using userServiceClient
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserServiceClient } from '@/lib/userServiceClient';
import type { CheckLimitRequest } from '@/lib/userServiceClient';

// ============================================================
// QUERY KEYS
// ============================================================

export const limitsKeys = {
  all: ['limits'] as const,
  my: () => [...limitsKeys.all, 'my'] as const,
  dailyUsage: () => [...limitsKeys.all, 'dailyUsage'] as const,
  checkLimit: (filters: Record<string, unknown>) => [...limitsKeys.all, 'check', filters] as const,
};

// ============================================================
// QUERIES
// ============================================================

/**
 * Get current user transaction limits
 */
export function useMyLimits() {
  const client = getUserServiceClient();

  return useQuery({
    queryKey: limitsKeys.my(),
    queryFn: () => client.getMyLimits(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get current user daily usage
 */
export function useMyDailyUsage() {
  const client = getUserServiceClient();

  return useQuery({
    queryKey: limitsKeys.dailyUsage(),
    queryFn: () => client.getMyDailyUsage(),
    staleTime: 1 * 60 * 1000, // 1 minute - changes frequently
  });
}

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Check if user can perform a transaction
 */
export function useCheckLimit() {
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: (request: CheckLimitRequest) => client.checkLimit(request),
  });
}
