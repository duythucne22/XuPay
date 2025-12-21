/* ============================================
   SAR API - Suspicious Activity Reports endpoints
   Layer 2: API Functions (calls client.ts)
   ============================================ */

import { paymentServiceClient } from './client'
import type {
  SARDTO,
  CreateSarRequestDTO,
  UpdateSarRequestDTO,
  PaginatedDTO,
} from '@/types/api'

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface SarQueryParams {
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
// SAR ENDPOINTS
// ============================================

export const sarApi = {
  /**
   * Get all SARs (admin only)
   * GET /api/v1/sars
   */
  getSars: async (params: SarQueryParams = {}): Promise<PaginatedDTO<SARDTO>> => {
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.set('page', String(params.page))
    if (params.size !== undefined) searchParams.set('size', String(params.size))
    if (params.status) searchParams.set('status', params.status)
    if (params.priority) searchParams.set('priority', params.priority)
    if (params.fromDate) searchParams.set('fromDate', params.fromDate)
    if (params.toDate) searchParams.set('toDate', params.toDate)
    if (params.assignedTo) searchParams.set('assignedTo', params.assignedTo)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection)

    const query = searchParams.toString()
    const path = query ? `/api/v1/sars?${query}` : '/api/v1/sars'
    
    return paymentServiceClient.get<PaginatedDTO<SARDTO>>(path)
  },

  /**
   * Get SAR by ID
   * GET /api/v1/sars/:sarId
   */
  getSarById: async (sarId: string): Promise<SARDTO> => {
    return paymentServiceClient.get<SARDTO>(`/api/v1/sars/${sarId}`)
  },

  /**
   * Create new SAR
   * POST /api/v1/sars
   */
  createSar: async (data: CreateSarRequestDTO): Promise<SARDTO> => {
    return paymentServiceClient.post<SARDTO>('/api/v1/sars', data)
  },

  /**
   * Update SAR
   * PUT /api/v1/sars/:sarId
   */
  updateSar: async (sarId: string, data: UpdateSarRequestDTO): Promise<SARDTO> => {
    return paymentServiceClient.put<SARDTO>(`/api/v1/sars/${sarId}`, data)
  },

  /**
   * Assign SAR to analyst
   * POST /api/v1/sars/:sarId/assign
   */
  assignSar: async (sarId: string, analystId: string): Promise<SARDTO> => {
    return paymentServiceClient.post<SARDTO>(`/api/v1/sars/${sarId}/assign`, { analystId })
  },

  /**
   * Start review of SAR
   * POST /api/v1/sars/:sarId/review
   */
  startReview: async (sarId: string): Promise<SARDTO> => {
    return paymentServiceClient.post<SARDTO>(`/api/v1/sars/${sarId}/review`)
  },

  /**
   * File SAR with regulatory authority
   * POST /api/v1/sars/:sarId/file
   */
  fileSar: async (sarId: string, filingNotes: string): Promise<SARDTO> => {
    return paymentServiceClient.post<SARDTO>(`/api/v1/sars/${sarId}/file`, { filingNotes })
  },

  /**
   * Dismiss SAR (false positive)
   * POST /api/v1/sars/:sarId/dismiss
   */
  dismissSar: async (sarId: string, reason: string): Promise<SARDTO> => {
    return paymentServiceClient.post<SARDTO>(`/api/v1/sars/${sarId}/dismiss`, { reason })
  },

  /**
   * Get SAR statistics
   * GET /api/v1/sars/stats
   */
  getStats: async (): Promise<{
    total: number
    pending: number
    reviewing: number
    filed: number
    dismissed: number
    byPriority: Record<string, number>
  }> => {
    return paymentServiceClient.get('/api/v1/sars/stats')
  },
}
