/**
 * Wallet Adapter - Converts API responses to component-compatible types
 * File: src/utils/walletAdapter.ts
 * 
 * Purpose:
 * - Transform WalletBalanceResponse (from payment service) to Wallet (component interface)
 * - Handle field mappings and derivations
 * - Support mock metadata for fields not yet in API
 */

import type { WalletBalanceResponse } from '@/lib/paymentServiceClient'
import type { Wallet } from '@/components/dashboard/WalletGrid'

/**
 * Metadata that supplements WalletBalanceResponse
 * These fields come from separate endpoints or mock data
 * TODO: Fetch from backend when endpoints are available
 */
export interface WalletMetadata {
  name?: string
  type?: 'PERSONAL' | 'MERCHANT' | 'ESCROW'
  createdAt?: string
  isDefault?: boolean
  lastTransaction?: {
    date: string
    amount: number
    description: string
  }
  transactionCount?: number
}

/**
 * Convert WalletBalanceResponse + metadata → Component Wallet interface
 * 
 * @param balance - API response from getWalletBalance() or getWalletByUserId()
 * @param metadata - Additional data not yet in API (name, type, etc.)
 * @returns Wallet object compatible with WalletGrid, WalletSettingsForm, etc.
 * 
 * @example
 * const balance = await client.getWalletBalance('wallet-123')
 * const wallet = adaptWalletFromBalance(balance, { name: 'My Wallet', type: 'PERSONAL' })
 */
export function adaptWalletFromBalance(
  balance: WalletBalanceResponse,
  metadata: WalletMetadata = {}
): Wallet {
  // Derive status from API boolean flags
  const status: 'active' | 'frozen' | 'inactive' = balance.isFrozen
    ? 'frozen'
    : balance.isActive
      ? 'active'
      : 'inactive'

  return {
    // Direct mappings from API
    id: balance.walletId,                          // walletId → id
    currency: balance.currency,
    balance: (balance.balanceCents / 100),         // Convert cents to dollars
    
    // Derived from API boolean flags
    status,
    
    // From metadata (pending backend endpoints)
    name: metadata.name || 'Wallet',
    type: metadata.type || 'PERSONAL',
    createdAt: metadata.createdAt || new Date().toISOString(),
    isDefault: metadata.isDefault || false,
    lastTransaction: metadata.lastTransaction,
    transactionCount: metadata.transactionCount || 0,
  }
}

/**
 * Derive wallet status from API fields
 * @param isActive - Whether wallet is active
 * @param isFrozen - Whether wallet is frozen
 * @returns Wallet status: 'active' | 'frozen' | 'inactive'
 */
export function deriveWalletStatus(
  isActive: boolean,
  isFrozen: boolean
): 'active' | 'frozen' | 'inactive' {
  if (isFrozen) return 'frozen'
  return isActive ? 'active' : 'inactive'
}

/**
 * Convert balance from cents to currency amount
 * @param balanceCents - Balance in cents (from API)
 * @returns Balance as decimal number
 * 
 * @example
 * convertBalanceFromCents(500000) // = 5000.00
 */
export function convertBalanceFromCents(balanceCents: number): number {
  return balanceCents / 100
}

/**
 * Convert balance from currency amount to cents
 * @param balanceAmount - Balance as decimal (for API)
 * @returns Balance in cents
 * 
 * @example
 * convertBalanceToCents(5000.00) // = 500000
 */
export function convertBalanceToCents(balanceAmount: number): number {
  return Math.round(balanceAmount * 100)
}

/**
 * Format balance for display with currency
 * @param balanceCents - Balance in cents
 * @param currency - Currency code (USD, VND, etc.)
 * @returns Formatted string
 * 
 * @example
 * formatBalance(500000, 'USD') // = "$5,000.00"
 * formatBalance(50000000, 'VND') // = "₫50,000,000"
 */
export function formatBalance(balanceCents: number, currency: string = 'USD'): string {
  const amount = convertBalanceFromCents(balanceCents)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Check if wallet can perform transactions
 * @param status - Wallet status
 * @returns true if wallet can be used for transactions
 */
export function canUseWallet(status: 'active' | 'frozen' | 'inactive'): boolean {
  return status === 'active'
}

/**
 * Get wallet type display label
 * @param type - Wallet type
 * @returns Human-readable label
 */
export function getWalletTypeLabel(type: 'PERSONAL' | 'MERCHANT' | 'ESCROW'): string {
  const labels = {
    PERSONAL: 'Personal',
    MERCHANT: 'Business',
    ESCROW: 'Escrow',
  }
  return labels[type] || 'Unknown'
}

/**
 * Get wallet status display label with color
 * @param status - Wallet status
 * @returns Object with label and tailwind color class
 */
export function getWalletStatusDisplay(status: 'active' | 'frozen' | 'inactive'): {
  label: string
  colorClass: string
  bgClass: string
} {
  const displays = {
    active: {
      label: 'Active',
      colorClass: 'text-green-600 dark:text-green-400',
      bgClass: 'bg-green-50 dark:bg-green-900/20',
    },
    frozen: {
      label: 'Frozen',
      colorClass: 'text-yellow-600 dark:text-yellow-400',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    inactive: {
      label: 'Inactive',
      colorClass: 'text-gray-600 dark:text-gray-400',
      bgClass: 'bg-gray-50 dark:bg-gray-900/20',
    },
  }
  return displays[status] || displays.inactive
}
