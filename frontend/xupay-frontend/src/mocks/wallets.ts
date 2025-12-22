/**
 * Mock Data Factories - Create test data consistent with API contracts
 * File: src/mocks/wallets.ts
 * 
 * Strategy:
 * 1. Factories create data matching real API structures (WalletBalanceResponse)
 * 2. Components are tested with adapted data (using walletAdapter)
 * 3. Ensures tests use realistic API response shapes
 */

import type { WalletBalanceResponse } from '@/lib/paymentServiceClient'
import type { Wallet } from '@/components/dashboard/WalletGrid'
import { adaptWalletFromBalance } from '@/utils/walletAdapter'

/**
 * Create a mock WalletBalanceResponse (direct from API)
 * These match what the payment service actually returns
 */
export function createMockWalletBalance(
  overrides?: Partial<WalletBalanceResponse>
): WalletBalanceResponse {
  return {
    walletId: 'wallet-' + Math.random().toString(36).slice(7),
    userId: 'user-' + Math.random().toString(36).slice(7),
    balanceCents: 150000, // $1,500.00
    balanceAmount: 1500.00, // Optional human-readable
    currency: 'USD',
    isActive: true,
    isFrozen: false,
    ...overrides,
  }
}

/**
 * Create a mock Wallet (component interface, adapted from API)
 * These are what components receive after using hooks and adapters
 */
export function createMockWallet(
  overrides?: Partial<Wallet>
): Wallet {
  // If status is provided in overrides, reflect it in the underlying balance flags
  const balanceOverrides: Partial<WalletBalanceResponse> = {}
  if (overrides?.status === 'frozen') {
    balanceOverrides.isFrozen = true
    balanceOverrides.isActive = false
  } else if (overrides?.status === 'inactive') {
    balanceOverrides.isActive = false
    balanceOverrides.isFrozen = false
  } else if (overrides?.status === 'active') {
    balanceOverrides.isActive = true
    balanceOverrides.isFrozen = false
  }

  const balance = createMockWalletBalance(balanceOverrides)
  return adaptWalletFromBalance(balance, {
    name: 'Test Wallet',
    type: 'PERSONAL',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isDefault: false,
    transactionCount: 12,
    ...overrides,
  })
}

/**
 * Create multiple mock wallets with different types and statuses
 */
export function createMockWallets(count: number = 3): Wallet[] {
  const types: ('PERSONAL' | 'MERCHANT' | 'ESCROW')[] = ['PERSONAL', 'MERCHANT', 'ESCROW']
  
  return Array.from({ length: count }, (_, i) => 
    createMockWallet({
      id: `wallet-${i + 1}`,
      name: ['My Wallet', 'Business Account', 'Escrow Account', 'Savings'][i % 4],
      type: types[i % types.length],
      balance: (i + 1) * 1000,
      status: i % 3 === 0 ? 'frozen' : i % 2 === 0 ? 'inactive' : 'active',
      currency: i === 0 ? 'USD' : i === 1 ? 'EUR' : 'VND',
      isDefault: i === 0,
      transactionCount: (i + 1) * 5,
    })
  )
}

/**
 * Create mock balance history point for charts
 */
export interface BalanceHistoryPoint {
  date: string // YYYY-MM-DD
  balance: number // In currency (dollars/euros), not cents
}

export function createMockBalanceHistoryPoint(
  overrides?: Partial<BalanceHistoryPoint>
): BalanceHistoryPoint {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  
  return {
    date: date.toISOString().split('T')[0],
    balance: 1500 + Math.random() * 500,
    ...overrides,
  }
}

/**
 * Create 30-day balance history for chart
 */
export function createMockBalanceHistory(days: number = 30): BalanceHistoryPoint[] {
  const baseDate = new Date()
  const history: BalanceHistoryPoint[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    
    history.push({
      date: date.toISOString().split('T')[0],
      balance: 1500 + Math.sin(i / 10) * 500 + Math.random() * 100,
    })
  }
  
  return history
}

/**
 * Create mock API error response
 */
export interface MockError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export function createMockError(
  overrides?: Partial<MockError>
): MockError {
  return {
    code: 'WALLET_ERROR',
    message: 'An error occurred with the wallet',
    ...overrides,
  }
}

/**
 * Preset mock data for common test scenarios
 */
export const MOCK_WALLET_PRESETS = {
  // Personal wallet, active, $1,500
  activePersonal: createMockWallet({
    id: 'wallet-1',
    name: 'Personal Wallet',
    type: 'PERSONAL',
    balance: 1500,
    status: 'active',
    currency: 'USD',
  }),
  
  // Business wallet, active, $5,000
  activeBusiness: createMockWallet({
    id: 'wallet-2',
    name: 'Business Account',
    type: 'MERCHANT',
    balance: 5000,
    status: 'active',
    currency: 'USD',
  }),
  
  // Frozen wallet
  frozenWallet: createMockWallet({
    id: 'wallet-3',
    name: 'Frozen Account',
    type: 'PERSONAL',
    balance: 2000,
    status: 'frozen',
    currency: 'USD',
  }),
  
  // Inactive wallet
  inactiveWallet: createMockWallet({
    id: 'wallet-4',
    name: 'Inactive Account',
    type: 'PERSONAL',
    balance: 0,
    status: 'inactive',
    currency: 'USD',
  }),
  
  // Escrow wallet
  escrowWallet: createMockWallet({
    id: 'wallet-5',
    name: 'Escrow Holding',
    type: 'ESCROW',
    balance: 10000,
    status: 'active',
    currency: 'USD',
  }),
  
  // High balance wallet
  highBalanceWallet: createMockWallet({
    id: 'wallet-6',
    name: 'Premium Savings',
    type: 'PERSONAL',
    balance: 500000,
    status: 'active',
    currency: 'USD',
  }),
  
  // Low balance wallet
  lowBalanceWallet: createMockWallet({
    id: 'wallet-7',
    name: 'Checking Account',
    type: 'PERSONAL',
    balance: 50,
    status: 'active',
    currency: 'USD',
  }),
  
  // Multi-currency wallet
  multiCurrencyWallet: createMockWallet({
    id: 'wallet-8',
    name: 'International',
    type: 'MERCHANT',
    balance: 25000,
    status: 'active',
    currency: 'VND',
  }),
}

/**
 * Get wallets by status for testing filters
 */
export function getMockWalletsByStatus(status: 'active' | 'frozen' | 'inactive'): Wallet[] {
  return Object.values(MOCK_WALLET_PRESETS).filter(w => w.status === status)
}

/**
 * Get wallets by type for testing filters
 */
export function getMockWalletsByType(type: 'PERSONAL' | 'MERCHANT' | 'ESCROW'): Wallet[] {
  return Object.values(MOCK_WALLET_PRESETS).filter(w => w.type === type)
}

/**
 * Get active wallets only
 */
export function getMockActiveWallets(): Wallet[] {
  return getMockWalletsByStatus('active')
}

/**
 * Get all preset wallets as array
 */
export function getAllMockWallets(): Wallet[] {
  return Object.values(MOCK_WALLET_PRESETS)
}

/**
 * Calculate totals from wallet list (for WalletSummaryStats)
 */
export interface WalletStats {
  totalBalance: number
  activeWallets: number
  walletsWithBalance: number
  totalTransactions: number
}

export function calculateWalletStats(wallets: Wallet[]): WalletStats {
  return {
    totalBalance: wallets.reduce((sum, w) => sum + w.balance, 0),
    activeWallets: wallets.filter(w => w.status === 'active').length,
    walletsWithBalance: wallets.filter(w => w.balance > 0).length,
    totalTransactions: wallets.reduce((sum, w) => sum + (w.transactionCount || 0), 0),
  }
}
