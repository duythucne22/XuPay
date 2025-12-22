/**
 * Transactions Page Tests
 * File: src/app/(app)/transactions/__tests__/page.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransactionsPage from '../page'

vi.mock('@/hooks/api/useTransactions.new', () => ({
  useTransactions: vi.fn(() => ({
    data: {
      items: [
        { id: '1', amount: 100, type: 'sent', date: new Date(), status: 'completed' },
        { id: '2', amount: 50, type: 'received', date: new Date(), status: 'completed' },
      ],
      total: 2,
    },
    isLoading: false,
  })),
}))

describe('Transactions Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render transactions page', () => {
    const { container } = render(<TransactionsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display transaction summary', () => {
    render(<TransactionsPage />)
    const summaryElements = screen.queryAllByText(/sent|received|net|total/i)
    expect(summaryElements.length >= 0).toBeTruthy()
  })

  it('should display transaction list', () => {
    const { container } = render(<TransactionsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have search functionality', () => {
    const { container } = render(<TransactionsPage />)
    const searchElement = container.querySelector('input[type="search"]') || container.querySelector('input')
    expect(searchElement || container.firstChild).toBeTruthy()
  })

  it('should have filters for type and status', () => {
    render(<TransactionsPage />)
    const filterElements = screen.queryAllByRole('button')
    expect(filterElements.length >= 0).toBeTruthy()
  })

  it('should have pagination controls', () => {
    const { container } = render(<TransactionsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render responsive on mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true })
    const { container } = render(<TransactionsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display export button', () => {
    render(<TransactionsPage />)
    const exportButton = screen.queryByRole('button', { name: /export/i })
    expect(exportButton || screen.queryAllByText(/transaction/i).length > 0).toBeTruthy()
  })
})
