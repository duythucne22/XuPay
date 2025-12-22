// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StatCard } from '../StatCard'

describe('StatCard', () => {
  it('should render skeleton while loading', () => {
    render(<StatCard label="KYC Tier" value="—" isLoading={true} />)
    expect(screen.getByTestId('stat-card-skeleton')).toBeInTheDocument()
  })

  it('should display label and value', async () => {
    render(<StatCard label="KYC Tier" value="TIER_2" />)

    await waitFor(() => {
      expect(screen.getByText('TIER_2')).toBeInTheDocument()
      expect(screen.getByTestId('stat-card')).toBeInTheDocument()
    })
  })

  it('should display unit when provided', () => {
    render(
      <StatCard
        label="Daily Limit"
        value="5000"
        unit="USD"
      />
    )

    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  it('should apply color classes based on color prop', () => {
    const { rerender } = render(
      <StatCard label="Test" value="100" color="blue" />
    )

    expect(screen.getByTestId('stat-card')).toHaveClass('from-blue-50')

    rerender(<StatCard label="Test" value="100" color="green" />)
    expect(screen.getByTestId('stat-card')).toHaveClass('from-green-50')
  })

  it('should call onClick handler when clicked', async () => {
    const onClick = vi.fn()

    render(
      <StatCard
        label="Test"
        value="100"
        onClick={onClick}
      />
    )

    const button = screen.getByTestId('stat-card')
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalled()
  })

  it('should be disabled and non-clickable when no onClick provided', () => {
    render(<StatCard label="Test" value="100" />)

    const button = screen.getByTestId('stat-card')
    expect(button).toBeDisabled()
  })

  it('should display icon when provided', () => {
    render(
      <StatCard
        label="Test"
        value="100"
        icon={<div data-testid="test-icon">📊</div>}
      />
    )

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should render with different colors', () => {
    const colors = ['blue', 'green', 'purple', 'amber', 'red'] as const

    colors.forEach((color) => {
      const { unmount } = render(
        <StatCard label="Test" value="100" color={color} />
      )

      expect(screen.getByTestId('stat-card')).toBeInTheDocument()
      unmount()
    })
  })
})
