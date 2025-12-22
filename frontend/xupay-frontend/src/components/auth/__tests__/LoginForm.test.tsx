import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useLogin } from '@/hooks/api/useAuth.new'
import { LoginForm } from '../LoginForm'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

// Mock the useLogin hook
vi.mock('@/hooks/api/useAuth.new', () => ({
  useLogin: vi.fn(),
}))

// Helper to render with QueryClient
function renderWithClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  let mockRouter: any
  let mockUseLogin: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockRouter = {
      push: vi.fn(),
    }
    vi.mocked(useRouter).mockReturnValue(mockRouter)

    mockUseLogin = {
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: null,
    }
    vi.mocked(useLogin).mockReturnValue(mockUseLogin)
  })

  it('should render login form with email and password inputs', () => {
    renderWithClient(<LoginForm />)

    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
  })

  it('should successfully login with valid credentials', () => {
    const onSuccess = vi.fn()

    renderWithClient(
      <LoginForm onSuccess={onSuccess} redirectTo="/dashboard" />
    )

    // Fill in form
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement
    const submitButton = screen.getByTestId('submit-button')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Verify mutation was called
    expect(mockUseLogin.mutate).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should disable inputs while loading', () => {
    mockUseLogin.isPending = true
    vi.mocked(useLogin).mockReturnValue(mockUseLogin)

    renderWithClient(<LoginForm />)

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)
    expect(emailInput.disabled).toBe(true)
    expect(passwordInput.disabled).toBe(true)
  })

  it('should call onSuccess callback when login succeeds', async () => {
    const onSuccess = vi.fn()

    mockUseLogin.isSuccess = true
    mockUseLogin.data = { user: { id: '123', email: 'test@example.com' } }
    vi.mocked(useLogin).mockReturnValue(mockUseLogin)

    renderWithClient(<LoginForm onSuccess={onSuccess} />)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({ id: '123', email: 'test@example.com' })
    })
  })

  it('should redirect to specified URL after successful login', async () => {
    mockUseLogin.isSuccess = true
    mockUseLogin.data = { user: { id: '123', email: 'test@example.com' } }
    vi.mocked(useLogin).mockReturnValue(mockUseLogin)

    renderWithClient(<LoginForm redirectTo="/custom-path" />)

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/custom-path')
    }, { timeout: 500 })
  })
})
