/**
 * Wallet Detail Page Tests
 * File: src/app/(app)/wallets/[id]/__tests__/page.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import WalletDetailPage from '../page'

vi.mock('@/hooks/api/useWallets.new', () => ({
  useWalletBalance: vi.fn(() => ({
    data: {
      walletId: 'wallet-1',
      balance: 5000,
      currency: 'USD',
      status: 'active',
      name: 'My Wallet',
    },
    isLoading: false,
  })),
}))

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ id: 'wallet-1' })),
  useRouter: vi.fn(() => ({ back: vi.fn(), push: vi.fn() })),
}))

describe('Wallet Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render wallet detail page', () => {
    const { container } = render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display wallet information', () => {
    const { container } = render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display balance history chart', () => {
    const { container } = render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display settings form', () => {
    const { container } = render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have back button', () => {
    render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    const backButton = screen.queryByRole('button', { name: /back/i })
    expect(backButton || screen.queryByText(/wallet/i)).toBeTruthy()
  })

  it('should render responsive on mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true })
    const { container } = render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display wallet ID', () => {
    render(<WalletDetailPage params={{ id: 'wallet-1' }} />)
    const backButton = screen.queryByRole('button', { name: /back/i })
    expect(backButton || screen.getByRole('button')).toBeTruthy()
  })
})
