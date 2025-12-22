// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecentTransactions } from '../RecentTransactions'

const { mockUseTransactions } = vi.hoisted(() => ({
  mockUseTransactions: vi.fn(),
}))

vi.mock('@/hooks/api/useTransactions.new', () => ({
  useTransactions: mockUseTransactions,
}))

function renderWithClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

describe('RecentTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton while loading', () => {
    mockUseTransactions.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" />)
    expect(screen.getByTestId('recent-transactions-skeleton')).toBeInTheDocument()
  })

  it('should show error when transactions fetch fails', () => {
    mockUseTransactions.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    })

    renderWithClient(<RecentTransactions userId="user-1" />)
    expect(screen.getByTestId('recent-transactions-error')).toBeInTheDocument()
  })

  it('should show empty state when no transactions', () => {
    mockUseTransactions.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" />)
    expect(screen.getByTestId('recent-transactions-empty')).toBeInTheDocument()
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })

  it('should display recent transactions', async () => {
    mockUseTransactions.mockReturnValue({
      data: {
        items: [
          {
            transactionId: 'tx-1',
            fromUserId: 'user-1',
            toUserId: 'user-2',
            amountCents: 50000,
            status: 'COMPLETED',
            type: 'sent',
          },
          {
            transactionId: 'tx-2',
            fromUserId: 'user-3',
            toUserId: 'user-1',
            amountCents: 30000,
            status: 'COMPLETED',
            type: 'received',
          },
        ],
        total: 2,
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" limit={5} />)

    await waitFor(() => {
      expect(screen.getByTestId('recent-transactions')).toBeInTheDocument()
      expect(screen.getByTestId('transaction-item-tx-1')).toBeInTheDocument()
      expect(screen.getByTestId('transaction-item-tx-2')).toBeInTheDocument()
    })
  })

  it('should show sent transactions with red arrow', async () => {
    mockUseTransactions.mockReturnValue({
      data: {
        items: [
          {
            transactionId: 'tx-1',
            fromUserId: 'user-1',
            toUserId: 'user-2',
            amountCents: 50000,
            status: 'COMPLETED',
            type: 'sent',
          },
        ],
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" />)

    await waitFor(() => {
      expect(screen.getByText('Sent')).toBeInTheDocument()
      expect(screen.getByText('-$500.00')).toBeInTheDocument()
    })
  })

  it('should show received transactions with green arrow', async () => {
    mockUseTransactions.mockReturnValue({
      data: {
        items: [
          {
            transactionId: 'tx-1',
            fromUserId: 'user-2',
            toUserId: 'user-1',
            amountCents: 30000,
            status: 'COMPLETED',
            type: 'received',
          },
        ],
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" />)

    await waitFor(() => {
      expect(screen.getByText('Received')).toBeInTheDocument()
      expect(screen.getByText('+$300.00')).toBeInTheDocument()
    })
  })

  it('should respect limit prop', async () => {
    const mockTxs = Array.from({ length: 10 }, (_, i) => ({
      transactionId: `tx-${i}`,
      fromUserId: 'user-1',
      toUserId: `user-${i}`,
      amountCents: 10000,
      status: 'COMPLETED',
    }))

    mockUseTransactions.mockReturnValue({
      data: { items: mockTxs },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" limit={5} />)

    await waitFor(() => {
      expect(screen.getByTestId('transaction-item-tx-0')).toBeInTheDocument()
      expect(screen.getByTestId('transaction-item-tx-4')).toBeInTheDocument()
      expect(screen.queryByTestId('transaction-item-tx-5')).not.toBeInTheDocument()
    })
  })

  it('should call onTransactionClick when transaction is clicked', async () => {
    const onTransactionClick = vi.fn()

    mockUseTransactions.mockReturnValue({
      data: {
        items: [
          {
            transactionId: 'tx-1',
            fromUserId: 'user-1',
            toUserId: 'user-2',
            amountCents: 50000,
            status: 'COMPLETED',
            type: 'sent',
          },
        ],
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(
      <RecentTransactions userId="user-1" onTransactionClick={onTransactionClick} />
    )

    const item = await screen.findByTestId('transaction-item-tx-1')
    fireEvent.click(item)

    expect(onTransactionClick).toHaveBeenCalledWith('tx-1')
  })

  it('should display status badges correctly', async () => {
    mockUseTransactions.mockReturnValue({
      data: {
        items: [
          {
            transactionId: 'tx-1',
            fromUserId: 'user-1',
            toUserId: 'user-2',
            amountCents: 50000,
            status: 'COMPLETED',
            type: 'sent',
          },
          {
            transactionId: 'tx-2',
            fromUserId: 'user-1',
            toUserId: 'user-2',
            amountCents: 30000,
            status: 'FAILED',
            type: 'sent',
          },
          {
            transactionId: 'tx-3',
            fromUserId: 'user-1',
            toUserId: 'user-2',
            amountCents: 20000,
            status: 'PROCESSING',
            type: 'sent',
          },
        ],
      },
      isLoading: false,
      isError: false,
    })

    renderWithClient(<RecentTransactions userId="user-1" limit={5} />)

    await waitFor(() => {
      expect(screen.getByText('COMPLETED')).toBeInTheDocument()
      expect(screen.getByText('FAILED')).toBeInTheDocument()
      expect(screen.getByText('PROCESSING')).toBeInTheDocument()
    })
  })
})
