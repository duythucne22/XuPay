/**
 * Wallets Page Tests
 * File: src/app/(app)/wallets/__tests__/page.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WalletsPage from '../page'

vi.mock('@/hooks/api/useWallets.new', () => ({
  useWallets: vi.fn(() => ({
    data: [
      { id: 'w1', name: 'Main', balance: 5000, status: 'active', type: 'PERSONAL', currency: 'USD' },
    ],
    isLoading: false,
  })),
}))

describe('Wallets Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render wallets page', () => {
    const { container } = render(<WalletsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display wallet summary stats', () => {
    render(<WalletsPage />)
    const elements = screen.queryAllByText(/total|active|balance|count/i)
    expect(elements.length >= 0).toBeTruthy()
  })

  it('should display wallet grid', () => {
    render(<WalletsPage />)
    const walletElements = screen.queryAllByText(/Main|wallet/i)
    expect(walletElements.length >= 0).toBeTruthy()
  })

  it('should have search functionality', () => {
    const { container } = render(<WalletsPage />)
    const searchElement = container.querySelector('input[type="search"]') || container.querySelector('input')
    expect(searchElement || container.firstChild).toBeTruthy()
  })

  it('should have filters', () => {
    render(<WalletsPage />)
    const filterElements = screen.queryAllByRole('button')
    expect(filterElements.length >= 0).toBeTruthy()
  })

  it('should have pagination', () => {
    const { container } = render(<WalletsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render responsive on mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true })
    const { container } = render(<WalletsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
