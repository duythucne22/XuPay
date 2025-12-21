/* ============================================
   API CLIENT - HTTP Layer
   Base configuration and interceptors
   ============================================ */

import type { ApiErrorDTO } from '@/types/api'

// ============================================
// CONFIGURATION
// ============================================

const API_CONFIG = {
  USER_SERVICE_URL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8081',
  PAYMENT_SERVICE_URL: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:8082',
  TIMEOUT: 30000,
} as const

// ============================================
// CUSTOM ERROR CLASS
// ============================================

export class ApiError extends Error {
  status: number
  code: string
  details?: Array<{ field: string; message: string }>

  constructor(
    message: string,
    status: number,
    code: string = 'UNKNOWN_ERROR',
    details?: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  static fromDTO(dto: ApiErrorDTO): ApiError {
    return new ApiError(dto.message, dto.status, dto.error, dto.details)
  }
}

// ============================================
// TOKEN STORAGE
// ============================================

const TOKEN_KEY = 'xupay_access_token'
const REFRESH_TOKEN_KEY = 'xupay_refresh_token'

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// ============================================
// BASE FETCH WRAPPER
// ============================================

interface FetchOptions extends RequestInit {
  timeout?: number
}

async function baseFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // Add auth header if token exists
  const token = tokenStorage.getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData: ApiErrorDTO
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          timestamp: new Date().toISOString(),
          status: response.status,
          error: response.statusText,
          message: `HTTP Error: ${response.status} ${response.statusText}`,
          path: url,
        }
      }
      throw ApiError.fromDTO(errorData)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT')
      }
      throw new ApiError(error.message, 0, 'NETWORK_ERROR')
    }

    throw new ApiError('Unknown error occurred', 0, 'UNKNOWN_ERROR')
  }
}

// ============================================
// SERVICE-SPECIFIC CLIENTS
// ============================================

export const userServiceClient = {
  get: <T>(path: string, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.USER_SERVICE_URL}${path}`, {
      method: 'GET',
      ...options,
    }),

  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.USER_SERVICE_URL}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.USER_SERVICE_URL}${path}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(path: string, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.USER_SERVICE_URL}${path}`, {
      method: 'DELETE',
      ...options,
    }),
}

export const paymentServiceClient = {
  get: <T>(path: string, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.PAYMENT_SERVICE_URL}${path}`, {
      method: 'GET',
      ...options,
    }),

  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.PAYMENT_SERVICE_URL}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.PAYMENT_SERVICE_URL}${path}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(path: string, options?: FetchOptions) =>
    baseFetch<T>(`${API_CONFIG.PAYMENT_SERVICE_URL}${path}`, {
      method: 'DELETE',
      ...options,
    }),
}
