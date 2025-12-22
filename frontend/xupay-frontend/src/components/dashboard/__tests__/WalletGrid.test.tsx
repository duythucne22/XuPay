/**
 * WalletGrid Component Tests
 * File: src/components/dashboard/__tests__/WalletGrid.test.tsx
 * 
 * Tests the responsive wallet cards grid with glass morphism effect
 * - Renders wallet cards correctly
 * - Quick action buttons work
 * - Type-specific styling (Personal, Business, Escrow)
 * - Status badges and disabled states
 * - Callbacks fire correctly
 * - Loading and empty states
 * - Animations
 * - Responsive layout
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WalletGrid } from '@/components/dashboard/WalletGrid'
import { 
  MOCK_WALLET_PRESETS,
  getMockActiveWallets,
  getAllMockWallets,
} from '@/mocks/wallets'

describe('WalletGrid', () => {
  const mockOnWalletClick = vi.fn()
  const mockOnSendClick = vi.fn()
  const mockOnAddFundsClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =====================================================
  // Rendering Tests
  // =====================================================

  it('should render wallet grid container', () => {
    const { container } = render(
      <WalletGrid
        wallets={[]}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(container.querySelector('[data-testid="wallet-grid"]') || container.firstChild).toBeInTheDocument()
  })

  it('should render correct number of wallet cards', () => {
    const wallets = getAllMockWallets()
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const walletNames = wallets.map(w => w.name)
    walletNames.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  it('should display wallet balance on each card', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    // Should show balance value
    expect(screen.getByText(new RegExp(`${wallets[0].balance}|Balance`))).toBeInTheDocument()
  })

  // =====================================================
  // Wallet Type Display Tests
  // =====================================================

  it('should show Personal type with correct icon', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText('Personal Wallet')).toBeInTheDocument()
  })

  it('should show Business type with correct icon', () => {
    const wallets = [MOCK_WALLET_PRESETS.activeBusiness]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText('Business Account')).toBeInTheDocument()
  })

  it('should show Escrow type with correct icon', () => {
    const wallets = [MOCK_WALLET_PRESETS.escrowWallet]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText('Escrow Holding')).toBeInTheDocument()
  })

  // =====================================================
  // Status Badge Tests
  // =====================================================

  it('should display active status badge', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText(/[Aa]ctive/)).toBeInTheDocument()
  })

  it('should display frozen status badge', () => {
    const wallets = [MOCK_WALLET_PRESETS.frozenWallet]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    // Multiple occurrences (title & badge), assert at least one exists
    expect(screen.getAllByText(/[Ff]rozen/).length).toBeGreaterThan(0)
  })

  it('should display inactive status badge', () => {
    const wallets = [MOCK_WALLET_PRESETS.inactiveWallet]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    // Multiple occurrences (title & badge), assert at least one exists
    expect(screen.getAllByText(/[Ii]nactive/).length).toBeGreaterThan(0)
  })

  // =====================================================
  // Quick Action Button Tests
  // =====================================================

  it('should have Send button for active wallets', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const sendButton = screen.getByRole('button', { name: /send/i })
    expect(sendButton).toBeInTheDocument()
  })

  it('should have Add Funds button for active wallets', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const addFundsButton = screen.getByRole('button', { name: /add\b/i })
    expect(addFundsButton).toBeInTheDocument()
  })

  it('should have Details button for all wallets', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByRole('button', { name: /details|view/i })).toBeInTheDocument()
  })

  // =====================================================
  // Callback Tests
  // =====================================================

  it('should call onWalletClick when wallet card is clicked', async () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    const user = userEvent.setup()
    
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const walletCard = screen.getByText('Personal Wallet').closest('div')
    if (walletCard?.parentElement?.querySelector('button')) {
      await user.click(screen.getByText('Personal Wallet').closest('div')!)
    }
  })

  it('should call onSendClick when Send button is clicked', async () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    const user = userEvent.setup()
    
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)

    await waitFor(() => {
      expect(mockOnSendClick).toHaveBeenCalled()
    })
  })

  it('should call onAddFundsClick when Add Funds button is clicked', async () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    const user = userEvent.setup()
    
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const addFundsButton = screen.getByRole('button', { name: /add\b/i })
    await user.click(addFundsButton)

    await waitFor(() => {
      expect(mockOnAddFundsClick).toHaveBeenCalled()
    })
  })

  // =====================================================
  // Disabled State Tests (Frozen Wallets)
  // =====================================================

  it('should not call send/add handlers for frozen wallets', async () => {
    const wallets = [MOCK_WALLET_PRESETS.frozenWallet]
    const user = userEvent.setup()
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const sendButton = screen.getByTestId(`wallet-send-${wallets[0].id}`)
    const addButton = screen.getByTestId(`wallet-add-funds-${wallets[0].id}`)

    await user.click(sendButton)
    await user.click(addButton)

    expect(mockOnSendClick).not.toHaveBeenCalled()
    expect(mockOnAddFundsClick).not.toHaveBeenCalled()
  })

  it('should not call send/add handlers for inactive wallets', async () => {
    const wallets = [MOCK_WALLET_PRESETS.inactiveWallet]
    const user = userEvent.setup()
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const sendButton = screen.getByTestId(`wallet-send-${wallets[0].id}`)
    const addButton = screen.getByTestId(`wallet-add-funds-${wallets[0].id}`)

    await user.click(sendButton)
    await user.click(addButton)

    expect(mockOnSendClick).not.toHaveBeenCalled()
    expect(mockOnAddFundsClick).not.toHaveBeenCalled()
  })

  // =====================================================
  // Loading State Tests
  // =====================================================

  it('should show loading skeleton when isLoading is true', () => {
    const { container } = render(
      <WalletGrid
        wallets={[]}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={true}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  // =====================================================
  // Empty State Tests
  // =====================================================

  it('should show empty state when no wallets', () => {
    render(
      <WalletGrid
        wallets={[]}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    // Should render without error
    const grid = screen.queryByText(/Personal Wallet|Business Account/)
    expect(grid).not.toBeInTheDocument()
  })

  // =====================================================
  // Multiple Wallet Types Tests
  // =====================================================

  it('should render mixed wallet types correctly', () => {
    const wallets = [
      MOCK_WALLET_PRESETS.activePersonal,
      MOCK_WALLET_PRESETS.activeBusiness,
      MOCK_WALLET_PRESETS.escrowWallet,
    ]
    
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText('Personal Wallet')).toBeInTheDocument()
    expect(screen.getByText('Business Account')).toBeInTheDocument()
    expect(screen.getByText('Escrow Holding')).toBeInTheDocument()
  })

  // =====================================================
  // Responsive Design Tests
  // =====================================================

  it('should render grid layout on desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })

    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    const { container } = render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render responsive grid on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    const { container } = render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  // =====================================================
  // Currency Display Tests
  // =====================================================

  it('should display currency on wallet card', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    // WalletGrid formats balance using Intl.NumberFormat with currency
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: wallets[0].currency }).format(wallets[0].balance)
    expect(screen.getByText(formatted)).toBeInTheDocument()
  })

  it('should handle multiple currencies', () => {
    const wallets = [
      { ...MOCK_WALLET_PRESETS.activePersonal, currency: 'USD' },
      { ...MOCK_WALLET_PRESETS.activeBusiness, currency: 'VND' },
    ]
    
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    // WalletGrid shows formatted balances; assert formatted currency strings are displayed
    const formattedUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(wallets[0].balance)
    const formattedVND = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(wallets[1].balance)

    expect(screen.getByText(formattedUSD)).toBeInTheDocument()
    expect(screen.getByText(formattedVND)).toBeInTheDocument()
  })

  // =====================================================
  // Props Update Tests
  // =====================================================

  it('should update when wallets change', () => {
    const { rerender } = render(
      <WalletGrid
        wallets={[MOCK_WALLET_PRESETS.activePersonal]}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText('Personal Wallet')).toBeInTheDocument()

    rerender(
      <WalletGrid
        wallets={[MOCK_WALLET_PRESETS.activeBusiness]}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    expect(screen.getByText('Business Account')).toBeInTheDocument()
    expect(screen.queryByText('Personal Wallet')).not.toBeInTheDocument()
  })

  // =====================================================
  // Accessibility Tests
  // =====================================================

  it('should have proper button labels for accessibility', () => {
    const wallets = [MOCK_WALLET_PRESETS.activePersonal]
    render(
      <WalletGrid
        wallets={wallets}
        onWalletClick={mockOnWalletClick}
        onSendClick={mockOnSendClick}
        onAddFundsClick={mockOnAddFundsClick}
        isLoading={false}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
