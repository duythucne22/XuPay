// @vitest-environment jsdom
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { http, HttpResponse } from 'msw'
import { getUserServiceClient } from '@/lib/userServiceClient'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useLogin, useRegister, useLogout, useValidateToken, authKeys } from '../useAuth.new'

// Small helper to render with a fresh QueryClient
function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const result = render(ui, { wrapper })
  return { ...result, queryClient }
}

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Test helper components
function LoginButton() {
  const mutation = useLogin()
  return (
    <button
      onClick={() => mutation.mutate({ email: 'test@example.com', password: 'P@ss' })}
      data-testid="login-btn"
    >
      Login
    </button>
  )
}

function RegisterButton() {
  const mutation = useRegister()
  return (
    <button
      onClick={() => mutation.mutate({ email: 'reg@example.com', password: 'P@ss', firstName: 'R', lastName: 'User' })}
      data-testid="register-btn"
    >
      Register
    </button>
  )
}

function LogoutButton() {
  const mutation = useLogout()
  return (
    <button onClick={() => mutation.mutate()} data-testid="logout-btn">
      Logout
    </button>
  )
}

function ValidateQuery() {
  const q = useValidateToken()
  if (q.isLoading) return <div data-testid="validating">loading</div>
  return <div data-testid="valid">{JSON.stringify(q.data)}</div>
}

describe('useAuth.new hooks (integration with MSW)', () => {
  it('useLogin stores token and sets current user in cache', async () => {
    const { queryClient } = renderWithClient(
      <div>
        <LoginButton />
      </div>
    )

    fireEvent.click(screen.getByTestId('login-btn'))

    // Wait for the mutation to settle and query client to be updated
    await waitFor(() => {
      const cached = queryClient.getQueryData(authKeys.currentUser())
      if (!cached) throw new Error('no cache yet')
    })

    const cached = queryClient.getQueryData(authKeys.currentUser())
    // should be populated with user object from mock handler
    expect((cached as any).email).toBeDefined()
  })

  it('useRegister stores token and sets current user in cache', async () => {
    const { queryClient } = renderWithClient(
      <div>
        <RegisterButton />
      </div>
    )

    fireEvent.click(screen.getByTestId('register-btn'))

    await waitFor(() => {
      const cached = queryClient.getQueryData(authKeys.currentUser())
      if (!cached) throw new Error('no cache yet')
    })

    const cached = queryClient.getQueryData(authKeys.currentUser())
    expect((cached as any).email).toBeDefined()
  })

  it('useValidateToken returns true on success', async () => {
    // Default handlers include validate endpoint that returns { valid: true }
    renderWithClient(<ValidateQuery />)

    // Wait for query to complete
    await waitFor(() => screen.getByTestId('valid'))

    expect(screen.getByTestId('valid').textContent).toContain('true')
  })

  it('validateToken surfaces 401 when token expired', async () => {
    // Override validate endpoint to return 401
    server.use(
      http.get('http://localhost:8081/api/auth/validate', () => HttpResponse.json({ code: 'UNAUTHORIZED', message: 'Token expired' }, { status: 401 }))
    )

    // Render the query hook
    const { queryClient } = renderWithClient(<ValidateQuery />)

    // Wait for the query to resolve and show invalid state
    await waitFor(() => screen.getByTestId('valid'))

    // The query should return { valid: false }
    const el = screen.getByTestId('valid')
    expect(el.textContent).toContain('false')

    // Calling client.validateToken() should resolve to { valid: false }
    await expect(getUserServiceClient().validateToken()).resolves.toEqual({ valid: false })
  })

  it('useLogout clears token and clears query cache', async () => {
    const { queryClient } = renderWithClient(
      <div>
        <LogoutButton />
      </div>
    )

    // seed a cached user and token
    queryClient.setQueryData(authKeys.currentUser(), { id: 'u1', email: 'a@b.com' })
    window.localStorage.setItem('accessToken', 'tok-1')

    fireEvent.click(screen.getByTestId('logout-btn'))

    await waitFor(() => {
      // expect cache to be cleared
      const cached = queryClient.getQueryData(authKeys.currentUser())
      if (cached) throw new Error('cache not cleared yet')
    })

    // token should be removed from storage
    expect(window.localStorage.getItem('accessToken')).toBeNull()
  })
})
