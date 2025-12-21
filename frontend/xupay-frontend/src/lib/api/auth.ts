/* ============================================
   AUTH API - Authentication endpoints
   Layer 2: API Functions (calls client.ts)
   ============================================ */

import { userServiceClient, tokenStorage } from './client'
import type {
  AuthTokensDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  UserDTO,
  SessionDTO,
  RefreshTokenRequestDTO,
  ChangePasswordRequestDTO,
} from '@/types/api'

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authApi = {
  /**
   * Login with email and password
   * POST /api/v1/auth/login
   */
  login: async (data: LoginRequestDTO): Promise<AuthTokensDTO> => {
    const tokens = await userServiceClient.post<AuthTokensDTO>(
      '/api/v1/auth/login',
      data
    )
    // Store tokens
    tokenStorage.setAccessToken(tokens.accessToken)
    tokenStorage.setRefreshToken(tokens.refreshToken)
    return tokens
  },

  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register: async (data: RegisterRequestDTO): Promise<AuthTokensDTO> => {
    const tokens = await userServiceClient.post<AuthTokensDTO>(
      '/api/v1/auth/register',
      data
    )
    // Store tokens
    tokenStorage.setAccessToken(tokens.accessToken)
    tokenStorage.setRefreshToken(tokens.refreshToken)
    return tokens
  },

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refreshToken: async (): Promise<AuthTokensDTO> => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const data: RefreshTokenRequestDTO = { refreshToken }
    const tokens = await userServiceClient.post<AuthTokensDTO>(
      '/api/v1/auth/refresh',
      data
    )
    // Update stored tokens
    tokenStorage.setAccessToken(tokens.accessToken)
    tokenStorage.setRefreshToken(tokens.refreshToken)
    return tokens
  },

  /**
   * Logout - invalidate current session
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await userServiceClient.post('/api/v1/auth/logout')
    } finally {
      // Always clear local tokens
      tokenStorage.clearTokens()
    }
  },

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword: async (data: ChangePasswordRequestDTO): Promise<void> => {
    await userServiceClient.post('/api/v1/auth/change-password', data)
  },

  /**
   * Get current authenticated user
   * GET /api/v1/users/me
   */
  getCurrentUser: async (): Promise<UserDTO> => {
    return userServiceClient.get<UserDTO>('/api/v1/users/me')
  },

  /**
   * Get active sessions
   * GET /api/v1/auth/sessions
   */
  getSessions: async (): Promise<SessionDTO[]> => {
    return userServiceClient.get<SessionDTO[]>('/api/v1/auth/sessions')
  },

  /**
   * Revoke a specific session
   * DELETE /api/v1/auth/sessions/:sessionId
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    await userServiceClient.delete(`/api/v1/auth/sessions/${sessionId}`)
  },

  /**
   * Revoke all sessions except current
   * DELETE /api/v1/auth/sessions
   */
  revokeAllSessions: async (): Promise<void> => {
    await userServiceClient.delete('/api/v1/auth/sessions')
  },
}
