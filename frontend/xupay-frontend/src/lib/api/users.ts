/* ============================================
   USERS API - User management endpoints
   Layer 2: API Functions (calls client.ts)
   ============================================ */

import { userServiceClient } from './client'
import type {
  UserDTO,
  UpdateUserRequestDTO,
  UpdateKycRequestDTO,
  PaginatedDTO,
} from '@/types/api'

// ============================================
// QUERY PARAMS TYPE
// ============================================

interface UserQueryParams {
  page?: number
  size?: number
  status?: string
  kycLevel?: string
  search?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

// ============================================
// USERS ENDPOINTS
// ============================================

export const usersApi = {
  /**
   * Get all users (admin only)
   * GET /api/v1/users
   */
  getUsers: async (params: UserQueryParams = {}): Promise<PaginatedDTO<UserDTO>> => {
    const searchParams = new URLSearchParams()
    if (params.page !== undefined) searchParams.set('page', String(params.page))
    if (params.size !== undefined) searchParams.set('size', String(params.size))
    if (params.status) searchParams.set('status', params.status)
    if (params.kycLevel) searchParams.set('kycLevel', params.kycLevel)
    if (params.search) searchParams.set('search', params.search)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection)

    const query = searchParams.toString()
    const path = query ? `/api/v1/users?${query}` : '/api/v1/users'
    
    return userServiceClient.get<PaginatedDTO<UserDTO>>(path)
  },

  /**
   * Get user by ID
   * GET /api/v1/users/:userId
   */
  getUserById: async (userId: string): Promise<UserDTO> => {
    return userServiceClient.get<UserDTO>(`/api/v1/users/${userId}`)
  },

  /**
   * Update user profile
   * PUT /api/v1/users/:userId
   */
  updateUser: async (userId: string, data: UpdateUserRequestDTO): Promise<UserDTO> => {
    return userServiceClient.put<UserDTO>(`/api/v1/users/${userId}`, data)
  },

  /**
   * Update user KYC status (admin only)
   * PUT /api/v1/users/:userId/kyc
   */
  updateKyc: async (userId: string, data: UpdateKycRequestDTO): Promise<UserDTO> => {
    return userServiceClient.put<UserDTO>(`/api/v1/users/${userId}/kyc`, data)
  },

  /**
   * Suspend user (admin only)
   * POST /api/v1/users/:userId/suspend
   */
  suspendUser: async (userId: string, reason: string): Promise<UserDTO> => {
    return userServiceClient.post<UserDTO>(`/api/v1/users/${userId}/suspend`, { reason })
  },

  /**
   * Reactivate user (admin only)
   * POST /api/v1/users/:userId/reactivate
   */
  reactivateUser: async (userId: string): Promise<UserDTO> => {
    return userServiceClient.post<UserDTO>(`/api/v1/users/${userId}/reactivate`)
  },

  /**
   * Delete user (admin only, soft delete)
   * DELETE /api/v1/users/:userId
   */
  deleteUser: async (userId: string): Promise<void> => {
    await userServiceClient.delete(`/api/v1/users/${userId}`)
  },
}
