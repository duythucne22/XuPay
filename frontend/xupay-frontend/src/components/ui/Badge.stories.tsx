import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default badge with emerald theme — primary status indicator.
 */
export const Default: Story = {
  args: {
    children: 'New',
    variant: 'default',
  },
}

/**
 * Secondary badge with glass effect.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

/**
 * Destructive badge for negative status (errors, warnings).
 */
export const Destructive: Story = {
  args: {
    children: 'Failed',
    variant: 'destructive',
  },
}

/**
 * Outline badge with border only.
 */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

/**
 * Success badge — green for completed/successful actions.
 * Use for: Transaction completed, verification done, active status.
 */
export const Success: Story = {
  args: {
    children: '✓ Complete',
    variant: 'success',
  },
}

/**
 * Warning badge — yellow for caution/pending states.
 * Use for: Pending review, action required, processing.
 */
export const Warning: Story = {
  args: {
    children: '⚠ Pending',
    variant: 'warning',
  },
}

/**
 * Error badge — red for failures/problems.
 * Use for: Failed transaction, error state, rejected.
 */
export const Error: Story = {
  args: {
    children: '✕ Error',
    variant: 'error',
  },
}

/**
 * Transaction status badges — typical use case.
 */
export const TransactionStatuses: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="secondary">Processing</Badge>
    </div>
  ),
}

/**
 * Wallet type badges — for wallet categorization.
 */
export const WalletTypes: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Badge variant="default">Checking</Badge>
      <Badge variant="secondary">Savings</Badge>
      <Badge variant="outline">Investment</Badge>
      <Badge variant="success">Active</Badge>
    </div>
  ),
}

/**
 * Badge with icon.
 */
export const WithIcon: Story = {
  args: {
    children: '🔒 Verified',
    variant: 'success',
  },
}

/**
 * Small badge for inline use in tables/lists.
 */
export const Inline: Story = {
  render: () => (
    <div className="text-sm">
      User is <Badge variant="success" className="inline-flex mx-1">Active</Badge> and verified
    </div>
  ),
}

/**
 * Badge in context — typical dashboard usage.
 */
export const InContext: Story = {
  render: () => (
    <div className="w-full max-w-md border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">Transfer to John Doe</h3>
          <p className="text-xs text-gray-400">$250.00</p>
        </div>
        <Badge variant="success">Completed</Badge>
      </div>
      <div className="text-xs text-gray-400">
        Dec 23, 2025 at 2:45 PM
      </div>
    </div>
  ),
}
