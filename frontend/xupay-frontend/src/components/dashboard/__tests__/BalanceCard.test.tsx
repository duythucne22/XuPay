// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BalanceCard } from '../BalanceCard'

const { mockUseWalletBalance } = vi.hoisted(() => ({
  mockUseWalletBalance: vi.fn(),
}))

vi.mock('@/hooks/api/useWallets.new', () => ({
  useWalletBalance: mockUseWalletBalance,
}))

function renderWithClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

describe('BalanceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton while loading', () => {
    mockUseWalletBalance.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    })

    renderWithClient(<BalanceCard walletId="wallet-123" />)
    expect(screen.getByTestId('balance-card-skeleton')).toBeInTheDocument()
  })

  it('should display balance when loaded', async () => {
    mockUseWalletBalance.mockReturnValue({
      data: {
        walletId: 'wallet-123',
        balanceCents: 30000,
        walletType: 'PERSONAL',
        isFrozen: false,
      },
      isLoading: false,
      isError: false,
      error: null,
    })

    renderWithClient(<BalanceCard walletId="wallet-123" />)

    await waitFor(() => {
      expect(screen.getByTestId('balance-card')).toBeInTheDocument()
      expect(screen.getByTestId('balance-amount')).toHaveTextContent('$300.00')
    }, { timeout: 2000 })
  })

  it('should show error state when balance fetch fails', () => {
    mockUseWalletBalance.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
    })

    renderWithClient(<BalanceCard walletId="wallet-123" />)
    expect(screen.getByTestId('balance-card-error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load balance')).toBeInTheDocument()
  })

  it('should display wallet type and status', async () => {
    mockUseWalletBalance.mockReturnValue({
      data: {
        walletId: 'wallet-123',
        balanceCents: 100000,
        walletType: 'MERCHANT',
        isFrozen: false,
      },
      isLoading: false,
      isError: false,
      error: null,
    })

    renderWithClient(<BalanceCard walletId="wallet-123" />)

    await waitFor(() => {
      expect(screen.getByText('MERCHANT')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  })

  it('should show frozen status when wallet is frozen', async () => {
    mockUseWalletBalance.mockReturnValue({
      data: {
        walletId: 'wallet-123',
        balanceCents: 100000,
        walletType: 'PERSONAL',
        isFrozen: true,
      },
      isLoading: false,
      isError: false,
      error: null,
    })

    renderWithClient(<BalanceCard walletId="wallet-123" />)

    await waitFor(() => {
      expect(screen.getByText('Frozen')).toBeInTheDocument()
    })
  })

  it('should call onLoadingChange callback when loading state changes', async () => {
    const onLoadingChange = vi.fn()

    mockUseWalletBalance.mockReturnValue({
      data: { walletId: 'w1', balanceCents: 50000, walletType: 'PERSONAL', isFrozen: false },
      isLoading: false,
      isError: false,
      error: null,
    })

    renderWithClient(
      <BalanceCard walletId="wallet-123" onLoadingChange={onLoadingChange} />
    )

    await waitFor(() => {
      expect(onLoadingChange).toHaveBeenCalledWith(false)
    })
  })
})
