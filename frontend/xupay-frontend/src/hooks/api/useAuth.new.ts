/* ============================================
   AUTH HOOKS (NEW) - Using userServiceClient
   Migrated from old lib/api approach
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserServiceClient } from '@/lib/userServiceClient';
import type { LoginRequest, RegisterRequest } from '@/lib/userServiceClient';

// ============================================================
// QUERY KEYS
// ============================================================

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  validate: () => [...authKeys.all, 'validate'] as const,
};

// ============================================================
// QUERIES
// ============================================================

/**
 * Get current authenticated user
 */
export function useCurrentUser() {
  const client = getUserServiceClient();

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => client.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if unauthorized
  });
}

/**
 * Validate current token
 */
export function useValidateToken() {
  const client = getUserServiceClient();

  return useQuery({
    queryKey: authKeys.validate(),
    queryFn: () => client.validateToken(),
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
}

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Register a new user
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: (request: RegisterRequest) => client.register(request),
    onSuccess: (data) => {
      // Store token
      client.setToken(data.accessToken);
      
      // Set current user in cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
  });
}

/**
 * Login user
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => client.login(request),
    onSuccess: (data) => {
      // Store token
      client.setToken(data.accessToken);
      
      // Set current user in cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Logout user
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: () => client.logout(),
    onSuccess: () => {
      // Clear token
      client.clearToken();
      
      // Clear all cached data
      queryClient.clear();
    },
  });
}
