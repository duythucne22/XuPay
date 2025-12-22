/* ============================================
   AUTH PROVIDER - Authentication state management
   Layer 5: React Provider (uses hooks/api/)
   ============================================ */

'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCurrentUser, useLogout } from '@/hooks/api'
import { tokenStorage } from '@/lib/api'
import type { User } from '@/types'

// ============================================
// TYPES
// ============================================

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ============================================
// PUBLIC ROUTES (no auth required)
// ============================================

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password']

function isPublicRoute(pathname: string): boolean {
  // Exact match for home page
  if (pathname === '/') return true
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Get current user from React Query
  const {
    data: user,
    isLoading: isUserLoading,
    isError,
    error,
  } = useCurrentUser()

  // Logout mutation
  const logoutMutation = useLogout()

  // Check if we have a token
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setHasToken(!!tokenStorage.getAccessToken())
    setMounted(true)
  }, [])

  // Handle authentication errors (expired token, etc.)
  useEffect(() => {
    if (isError && error && !isPublicRoute(pathname)) {
      // Token is invalid, clear it and redirect to login
      tokenStorage.clearTokens()
      setHasToken(false)
      router.push('/login')
    }
  }, [isError, error, pathname, router])

  // Redirect logic
  useEffect(() => {
    if (!mounted) return

    const publicRoute = isPublicRoute(pathname)

    // If on protected route without token, redirect to login
    if (!publicRoute && !hasToken) {
      router.push('/login')
      return
    }

    // If on login/register with valid user, redirect to dashboard
    if (publicRoute && user) {
      router.push('/dashboard')
    }
  }, [mounted, hasToken, user, pathname, router])

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
    setHasToken(false)
    router.push('/login')
  }, [logoutMutation, router])

  // Loading states
  const isLoading = !mounted || (hasToken && isUserLoading)

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================
// HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
