// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletSelector } from '../WalletSelector'

const { mockUseUserWallet } = vi.hoisted(() => ({
  mockUseUserWallet: vi.fn(),
}))

vi.mock('@/hooks/api/useWallets.new', () => ({
  useUserWallet: mockUseUserWallet,
}))

function renderWithClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

describe('WalletSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton while loading', () => {
    mockUseUserWallet.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    renderWithClient(<WalletSelector userId="user-1" />)
    expect(screen.getByTestId('wallet-selector-skeleton')).toBeInTheDocument()
  })

  it('should show error when wallet fetch fails', () => {
    mockUseUserWallet.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    renderWithClient(<WalletSelector userId="user-1" />)
    expect(screen.getByTestId('wallet-selector-error')).toBeInTheDocument()
  })

  it('should display wallet button with type and balance', async () => {
    mockUseUserWallet.mockReturnValue({
      data: {
        walletId: 'wallet-1',
        currency: 'PERSONAL',
        balanceCents: 100000,
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<WalletSelector userId="user-1" />)

    await waitFor(() => {
      expect(screen.getByTestId('wallet-selector-button')).toBeInTheDocument()
      expect(screen.getByText(/PERSONAL/)).toBeInTheDocument()
      expect(screen.getByText(/\$1000\.00/)).toBeInTheDocument()
    })
  })

  it('should open dropdown when button clicked', async () => {
    mockUseUserWallet.mockReturnValue({
      data: {
        walletId: 'wallet-1',
        currency: 'PERSONAL',
        balanceCents: 100000,
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<WalletSelector userId="user-1" />)

    const button = screen.getByTestId('wallet-selector-button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByTestId('wallet-selector-dropdown')).toBeInTheDocument()
    })
  })

  it('should call onWalletSelect when option is selected', async () => {
    const onWalletSelect = vi.fn()

    mockUseUserWallet.mockReturnValue({
      data: {
        walletId: 'wallet-1',
        currency: 'PERSONAL',
        balanceCents: 100000,
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(
      <WalletSelector userId="user-1" onWalletSelect={onWalletSelect} />
    )

    const button = screen.getByTestId('wallet-selector-button')
    fireEvent.click(button)

    const option = screen.getByTestId('wallet-option')
    fireEvent.click(option)

    await waitFor(() => {
      expect(onWalletSelect).toHaveBeenCalledWith('wallet-1')
    })
  })

  it('should highlight selected wallet', async () => {
    mockUseUserWallet.mockReturnValue({
      data: {
        walletId: 'wallet-1',
        walletType: 'PERSONAL',
        balanceCents: 100000,
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(
      <WalletSelector userId="user-1" selectedWalletId="wallet-1" />
    )

    await waitFor(() => {
      expect(screen.getByTestId('wallet-selector-button')).toHaveClass('bg-blue-50')
    })
  })
})
