/* ============================================
   AUTH HOOKS - Authentication React Query hooks
   Layer 4: React Query (uses api/, adapters/)
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { mapUserDTOToUser } from '@/lib/adapters'
import type { LoginRequestDTO, RegisterRequestDTO, ChangePasswordRequestDTO } from '@/types/api'
import type { User } from '@/types'

// ============================================
// QUERY KEYS
// ============================================

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User> => {
      const dto = await authApi.getCurrentUser()
      return mapUserDTOToUser(dto)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  })
}

/**
 * Hook to get user sessions
 */
export function useSessions() {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: () => authApi.getSessions(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook for login
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequestDTO) => authApi.login(data),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}

/**
 * Hook for registration
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequestDTO) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear()
    },
  })
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequestDTO) => authApi.changePassword(data),
  })
}

/**
 * Hook for refreshing token
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
  })
}

/**
 * Hook for revoking a session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() })
    },
  })
}

/**
 * Hook for revoking all sessions
 */
export function useRevokeAllSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() })
    },
  })
}
