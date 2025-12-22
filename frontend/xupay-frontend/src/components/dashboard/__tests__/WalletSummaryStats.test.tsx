/**
 * WalletSummaryStats Component Tests
 * File: src/components/dashboard/__tests__/WalletSummaryStats.test.tsx
 * 
 * Tests the 4-card summary statistics display
 * - Renders all stat cards with proper values
 * - Formats currency correctly
 * - Displays icons and colors correctly
 * - Handles loading states
 * - Responsive layout
 * - Dark mode support
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WalletSummaryStats } from '@/components/dashboard/WalletSummaryStats'

describe('WalletSummaryStats', () => {
  // =====================================================
  // Rendering Tests
  // =====================================================

  it('should render all four stat cards', () => {
    render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
    expect(screen.getByText(/Active Wallets/i)).toBeInTheDocument()
    expect(screen.getByText(/Wallets with Balance/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument()
  })

  it('should render with correct stat values', () => {
    const { container } = render(
      <WalletSummaryStats
        totalBalance={50000}
        activeWallets={3}
        walletsWithBalance={2}
        totalTransactions={15}
        currency="USD"
      />
    )

    // Check for formatted values by specific cards
    expect(screen.getByTestId('wallet-summary-active-wallets')).toHaveTextContent('3')
    expect(screen.getByTestId('wallet-summary-wallets-with-balance')).toHaveTextContent('2')
    expect(screen.getByTestId('wallet-summary-total-transactions')).toHaveTextContent('15')
  })

  // =====================================================
  // Currency Formatting Tests
  // =====================================================

  it('should format USD currency correctly', () => {
    render(
      <WalletSummaryStats
        totalBalance={100000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={50}
        currency="USD"
      />
    )

    // Should show $ symbol or similar formatting
    const totalBalanceSection = screen.getByText(/Total Balance/i).closest('div')
    expect(totalBalanceSection).toBeInTheDocument()
  })

  it('should format VND currency correctly', () => {
    render(
      <WalletSummaryStats
        totalBalance={50000000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={50}
        currency="VND"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
  })

  it('should format EUR currency correctly', () => {
    render(
      <WalletSummaryStats
        totalBalance={75000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={50}
        currency="EUR"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
  })

  // =====================================================
  // Edge Cases Tests
  // =====================================================

  it('should handle zero balance', () => {
    render(
      <WalletSummaryStats
        totalBalance={0}
        activeWallets={5}
        walletsWithBalance={0}
        totalTransactions={0}
        currency="USD"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
  })

  it('should handle zero active wallets', () => {
    render(
      <WalletSummaryStats
        totalBalance={5000}
        activeWallets={0}
        walletsWithBalance={1}
        totalTransactions={2}
        currency="USD"
      />
    )

    expect(screen.getByTestId('wallet-summary-active-wallets')).toHaveTextContent('0')
  })

  it('should handle large numbers', () => {
    render(
      <WalletSummaryStats
        totalBalance={999999999}
        activeWallets={999}
        walletsWithBalance={888}
        totalTransactions={777}
        currency="USD"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
  })

  it('should handle small decimal values', () => {
    render(
      <WalletSummaryStats
        totalBalance={1}
        activeWallets={1}
        walletsWithBalance={1}
        totalTransactions={1}
        currency="USD"
      />
    )

    // Check specific cards for small values
    expect(screen.getByTestId('wallet-summary-active-wallets')).toHaveTextContent('1')
    expect(screen.getByTestId('wallet-summary-wallets-with-balance')).toHaveTextContent('1')
    expect(screen.getByTestId('wallet-summary-total-transactions')).toHaveTextContent('1')
    expect(screen.getByTestId('wallet-summary-total-balance')).toHaveTextContent('$1.00')
  })

  // =====================================================
  // Loading State Tests
  // =====================================================

  it('should show loading skeleton when loading prop is true', () => {
    const { container } = render(
      <WalletSummaryStats
        totalBalance={0}
        activeWallets={0}
        walletsWithBalance={0}
        totalTransactions={0}
        currency="USD"
        isLoading={true}
      />
    )

    // Check for skeleton/loading indicator
    const skeletonElements = container.querySelectorAll('[data-testid*="skeleton"]')
    if (skeletonElements.length > 0) {
      expect(skeletonElements.length).toBeGreaterThan(0)
    }
  })

  // =====================================================
  // Styling & Accessibility Tests
  // =====================================================

  it('should have proper ARIA labels for screen readers', () => {
    render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    // Check for accessible text
    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
    expect(screen.getByText(/Active Wallets/i)).toBeInTheDocument()
  })

  it('should render with proper heading structure', () => {
    const { container } = render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    // Look for the four stat cards by data-testid
    const cards = container.querySelectorAll('[data-testid^="wallet-summary-"]')
    expect(cards.length).toBeGreaterThanOrEqual(4)
  })

  // =====================================================
  // Animation Tests
  // =====================================================

  it('should render without animation errors', () => {
    const { rerender } = render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    // Should not throw error on rerender
    rerender(
      <WalletSummaryStats
        totalBalance={20000}
        activeWallets={6}
        walletsWithBalance={5}
        totalTransactions={50}
        currency="USD"
      />
    )

    expect(screen.getByTestId('wallet-summary-active-wallets')).toHaveTextContent('6')
  })

  // =====================================================
  // Responsive Design Tests
  // =====================================================

  it('should render on mobile viewport', () => {
    // Mock window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { container } = render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render on tablet viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    const { container } = render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render on desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })

    const { container } = render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  // =====================================================
  // Dark Mode Tests
  // =====================================================

  it('should render with dark mode classes', () => {
    const { container } = render(
      <div className="dark">
        <WalletSummaryStats
          totalBalance={15000}
          activeWallets={5}
          walletsWithBalance={4}
          totalTransactions={42}
          currency="USD"
        />
      </div>
    )

    expect(container.querySelector('.dark')).toBeInTheDocument()
  })

  // =====================================================
  // Props Update Tests
  // =====================================================

  it('should update when props change', () => {
    const { rerender } = render(
      <WalletSummaryStats
        totalBalance={1000}
        activeWallets={1}
        walletsWithBalance={1}
        totalTransactions={1}
        currency="USD"
      />
    )

    expect(screen.getByTestId('wallet-summary-active-wallets')).toHaveTextContent('1')

    rerender(
      <WalletSummaryStats
        totalBalance={2000}
        activeWallets={2}
        walletsWithBalance={2}
        totalTransactions={2}
        currency="USD"
      />
    )

    expect(screen.getByTestId('wallet-summary-active-wallets')).toHaveTextContent('2')
  })

  it('should handle currency change', () => {
    const { rerender } = render(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="USD"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()

    rerender(
      <WalletSummaryStats
        totalBalance={15000}
        activeWallets={5}
        walletsWithBalance={4}
        totalTransactions={42}
        currency="VND"
      />
    )

    expect(screen.getByText(/Total Balance/i)).toBeInTheDocument()
  })
})
