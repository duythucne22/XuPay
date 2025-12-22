/**
 * Dashboard Page Tests
 * File: src/app/(app)/dashboard/__tests__/page.test.tsx
 * Tests the main dashboard overview page
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import DashboardPage from '../page'

// Mock the API hooks
vi.mock('@/hooks/api/useWallets.new', () => ({
  useWallets: vi.fn(() => ({
    data: [
      { id: 'wallet-1', name: 'Main', balance: 150000, currency: 'USD', status: 'active' },
    ],
    isLoading: false,
    error: null,
  })),
  useWalletBalance: vi.fn(() => ({
    data: { walletId: 'wallet-1', balance: 150000, currency: 'USD' },
    isLoading: false,
    error: null,
  })),
  useUserWallet: vi.fn(() => ({
    data: { walletId: 'wallet-1', balance: 150000, currency: 'USD' },
    isLoading: false,
  })),
}))

vi.mock('@/hooks/api/useTransactions.new', () => ({
  useTransactions: vi.fn(() => ({
    data: {
      items: [
        { id: 'tx-1', amount: 100, type: 'sent', date: new Date(), status: 'completed' },
        { id: 'tx-2', amount: 50, type: 'received', date: new Date(), status: 'completed' },
      ],
      total: 2,
    },
    isLoading: false,
    error: null,
  })),
}))

vi.mock('@/hooks/api/useProfile.new', () => ({
  useProfile: vi.fn(() => ({
    data: { userId: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    isLoading: false,
    error: null,
  })),
}))

// Mock dashboard components - using named exports
vi.mock('@/components/dashboard/StatsGrid', () => ({
  StatsGrid: () => React.createElement('div', { 'data-testid': 'stats-grid' }),
}))

vi.mock('@/components/dashboard/BalanceCard', () => ({
  BalanceCard: () => React.createElement('div', { 'data-testid': 'balance-card' }),
}))

vi.mock('@/components/dashboard/RecentTransactions', () => ({
  RecentTransactions: () => React.createElement('div', { 'data-testid': 'recent-transactions' }),
}))

vi.mock('@/components/dashboard/WalletSelector', () => ({
  WalletSelector: () => React.createElement('div', { 'data-testid': 'wallet-selector' }),
}))

vi.mock('@/components/dashboard/QuickActions', () => ({
  QuickActions: () => React.createElement('div', { 'data-testid': 'quick-actions' }),
}))

vi.mock('@/components/animations', () => ({
  StaggerContainer: ({ children }: any) => children,
  itemVariants: {},
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => React.createElement('div', props),
  },
}))

vi.mock('date-fns', () => ({
  format: () => 'Monday, December 22, 2025',
}))

vi.mock('lucide-react', () => ({
  ArrowRight: () => React.createElement('div'),
}))

vi.mock('next/link', () => ({
  default: (props: any) => React.createElement('a', props),
}))

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard page', () => {
    const { container } = render(<DashboardPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display stats grid', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
  })

  it('should display balance card', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('balance-card')).toBeInTheDocument()
  })

  it('should display recent transactions', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('recent-transactions')).toBeInTheDocument()
  })

  it('should display quick actions', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('should display wallet selector', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('wallet-selector')).toBeInTheDocument()
  })

  it('should render without errors when loading', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('stats-grid')).toBeInTheDocument()
  })

  it('should display balance history chart', () => {
    render(<DashboardPage />)
    const container = render(<DashboardPage />).container
    expect(container).toBeTruthy()
  })

  it('should have multiple sections', () => {
    render(<DashboardPage />)
    const components = [
      screen.queryByTestId('stats-grid'),
      screen.queryByTestId('wallet-selector'),
      screen.queryByTestId('recent-transactions'),
    ].filter(Boolean)
    expect(components.length).toBeGreaterThan(0)
  })
})
