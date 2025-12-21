/* ============================================
   SAR HOOKS - Suspicious Activity Reports React Query hooks
   Layer 4: React Query (uses api/, adapters/)
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sarApi } from '@/lib/api'
import { mapSarDTOToSar, mapPaginatedSars } from '@/lib/adapters'
import type { CreateSarRequestDTO, UpdateSarRequestDTO } from '@/types/api'
import type { SAR, PaginatedResponse } from '@/types'

// ============================================
// QUERY KEYS
// ============================================

export const sarKeys = {
  all: ['sars'] as const,
  lists: () => [...sarKeys.all, 'list'] as const,
  list: (filters: UseSarsParams) => [...sarKeys.lists(), filters] as const,
  details: () => [...sarKeys.all, 'detail'] as const,
  detail: (id: string) => [...sarKeys.details(), id] as const,
  stats: () => [...sarKeys.all, 'stats'] as const,
}

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface UseSarsParams {
  page?: number
  size?: number
  status?: 'pending' | 'reviewing' | 'filed' | 'dismissed'
  priority?: 'low' | 'medium' | 'high' | 'critical'
  fromDate?: string
  toDate?: string
  assignedTo?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

// ============================================
// QUERIES
// ============================================

/**
 * Hook to get paginated SARs list
 */
export function useSars(params: UseSarsParams = {}) {
  return useQuery({
    queryKey: sarKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<SAR>> => {
      const dto = await sarApi.getSars(params)
      return mapPaginatedSars(dto)
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to get a single SAR by ID
 */
export function useSar(sarId: string) {
  return useQuery({
    queryKey: sarKeys.detail(sarId),
    queryFn: async (): Promise<SAR> => {
      const dto = await sarApi.getSarById(sarId)
      return mapSarDTOToSar(dto)
    },
    enabled: !!sarId,
  })
}

/**
 * Hook to get SAR statistics
 */
export function useSarStats() {
  return useQuery({
    queryKey: sarKeys.stats(),
    queryFn: () => sarApi.getStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook for creating a new SAR
 */
export function useCreateSar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSarRequestDTO) => sarApi.createSar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sarKeys.stats() })
    },
  })
}

/**
 * Hook for updating a SAR
 */
export function useUpdateSar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sarId, data }: { sarId: string; data: UpdateSarRequestDTO }) =>
      sarApi.updateSar(sarId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sarKeys.detail(variables.sarId) })
      queryClient.invalidateQueries({ queryKey: sarKeys.lists() })
    },
  })
}

/**
 * Hook for assigning a SAR to an analyst
 */
export function useAssignSar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sarId, analystId }: { sarId: string; analystId: string }) =>
      sarApi.assignSar(sarId, analystId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sarKeys.detail(variables.sarId) })
      queryClient.invalidateQueries({ queryKey: sarKeys.lists() })
    },
  })
}

/**
 * Hook for starting SAR review
 */
export function useStartSarReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sarId: string) => sarApi.startReview(sarId),
    onSuccess: (_, sarId) => {
      queryClient.invalidateQueries({ queryKey: sarKeys.detail(sarId) })
      queryClient.invalidateQueries({ queryKey: sarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sarKeys.stats() })
    },
  })
}

/**
 * Hook for filing a SAR
 */
export function useFileSar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sarId, filingNotes }: { sarId: string; filingNotes: string }) =>
      sarApi.fileSar(sarId, filingNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sarKeys.detail(variables.sarId) })
      queryClient.invalidateQueries({ queryKey: sarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sarKeys.stats() })
    },
  })
}

/**
 * Hook for dismissing a SAR
 */
export function useDismissSar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sarId, reason }: { sarId: string; reason: string }) =>
      sarApi.dismissSar(sarId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sarKeys.detail(variables.sarId) })
      queryClient.invalidateQueries({ queryKey: sarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sarKeys.stats() })
    },
  })
}
