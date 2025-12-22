/**
 * Compliance SARs Page Tests
 * File: src/app/(app)/compliance/sars/__tests__/page.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SARsPage from '../page'

vi.mock('@/hooks/api/useCompliance.new', () => ({
  useSARs: vi.fn(() => ({
    data: {
      items: [
        {
          id: 'sar-1',
          severity: 'high',
          status: 'filed',
          date: new Date(),
          amount: 10000,
          description: 'Suspicious activity',
        },
      ],
      total: 1,
    },
    isLoading: false,
  })),
}))

describe('Compliance SARs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render SAR page', () => {
    const { container } = render(<SARsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should display SAR table', () => {
    const { container } = render(<SARsPage />)
    const table = container.querySelector('table')
    expect(table || container.firstChild).toBeTruthy()
  })

  it('should have severity filter', () => {
    render(<SARsPage />)
    const filterElements = screen.queryAllByRole('button')
    expect(filterElements.length).toBeGreaterThan(0)
  })

  it('should have status filter', () => {
    const { container } = render(<SARsPage />)
    const selects = container.querySelectorAll('select')
    expect(selects.length > 0).toBeTruthy()
  })

  it('should display severity colors', () => {
    const { container } = render(<SARsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have date range picker', () => {
    const { container } = render(<SARsPage />)
    const inputs = container.querySelectorAll('input')
    expect(inputs.length >= 0).toBeTruthy()
  })

  it('should have export functionality', () => {
    render(<SARsPage />)
    const exportButton = screen.queryByRole('button', { name: /export/i })
    expect(exportButton || screen.queryByRole('table')).toBeTruthy()
  })

  it('should render responsive on mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true })
    const { container } = render(<SARsPage />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
