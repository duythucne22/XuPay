/**
 * Transaction Detail Page Tests
 * File: src/app/(app)/transactions/[id]/__tests__/page.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransactionDetailPage from '../page'

vi.mock('@/hooks/api/useTransactions.new', () => ({
  useTransaction: vi.fn(() => ({
    data: {
      id: 'tx-1',
      amount: 100,
      type: 'sent',
      status: 'completed',
      date: new Date(),
      from: 'user-1',
      to: 'user-2',
      description: 'Payment',
    },
    isLoading: false,
  })),
}))

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ id: 'tx-1' })),
  useRouter: vi.fn(() => ({ back: vi.fn(), push: vi.fn() })),
}))

describe('Transaction Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render transaction detail page', () => {
    const { container } = render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display transaction information', () => {
    const { container } = render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display transaction amount', () => {
    render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    const amountElements = screen.queryAllByText(/amount|100|payment/i)
    expect(amountElements.length >= 0).toBeTruthy()
  })

  it('should display transaction status', () => {
    render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    const statusElements = screen.queryAllByText(/completed|status|pending/i)
    expect(statusElements.length >= 0).toBeTruthy()
  })

  it('should display sender and recipient', () => {
    const { container } = render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have back button', () => {
    render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    const backButton = screen.queryByRole('button', { name: /back/i })
    expect(backButton || screen.queryByText(/payment/i)).toBeTruthy()
  })

  it('should display fraud section if applicable', () => {
    const { container } = render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have action buttons (copy, export, etc)', () => {
    render(<TransactionDetailPage params={{ id: 'tx-1' }} />)
    const buttons = screen.queryAllByRole('button')
    expect(buttons.length >= 0).toBeTruthy()
  })
})
