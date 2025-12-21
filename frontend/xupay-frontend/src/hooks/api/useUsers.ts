/* ============================================
   USERS HOOKS - User management React Query hooks
   Layer 4: React Query (uses api/, adapters/)
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { mapUserDTOToUser, mapPaginatedUsers } from '@/lib/adapters'
import type { UpdateUserRequestDTO, UpdateKycRequestDTO } from '@/types/api'
import type { User, PaginatedResponse } from '@/types'

// ============================================
// QUERY KEYS
// ============================================

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface UseUsersParams extends Record<string, unknown> {
  page?: number
  size?: number
  status?: string
  kycLevel?: string
  search?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook to get paginated users list
 */
export function useUsers(params: UseUsersParams = {}) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const dto = await usersApi.getUsers(params)
      return mapPaginatedUsers(dto)
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get a single user by ID
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: async (): Promise<User> => {
      const dto = await usersApi.getUserById(userId)
      return mapUserDTOToUser(dto)
    },
    enabled: !!userId,
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook for updating user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequestDTO }) =>
      usersApi.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.userId) })
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

/**
 * Hook for updating user KYC
 */
export function useUpdateKyc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateKycRequestDTO }) =>
      usersApi.updateKyc(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.userId) })
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

/**
 * Hook for suspending a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      usersApi.suspendUser(userId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.userId) })
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

/**
 * Hook for reactivating a user
 */
export function useReactivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => usersApi.reactivateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}
