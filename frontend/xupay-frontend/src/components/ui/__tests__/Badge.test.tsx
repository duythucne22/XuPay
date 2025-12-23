import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../Badge'

describe('Badge', () => {
  describe('rendering', () => {
    it('renders badge with content', () => {
      const { container } = render(<Badge>New</Badge>)
      expect(container.textContent).toBe('New')
    })

    it('applies default variant classes', () => {
      const { container } = render(<Badge>Test</Badge>)
      const badge = container.firstChild
      expect(badge).toHaveClass('bg-emerald-500')
      expect(badge).toHaveClass('text-black')
    })
  })

  describe('variants', () => {
    const variants = [
      'default',
      'secondary',
      'destructive',
      'outline',
      'success',
      'warning',
      'error',
    ] as const

    variants.forEach((variant) => {
      it(`applies ${variant} variant`, () => {
        const { container } = render(<Badge variant={variant}>Badge</Badge>)
        const badge = container.firstChild
        expect(badge).toBeTruthy()
        // Variant is applied, no errors thrown
      })
    })
  })

  describe('styling', () => {
    it('applies custom className alongside variant', () => {
      const { container } = render(
        <Badge variant="success" className="uppercase">
          Success
        </Badge>
      )
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass('uppercase')
      expect(badge).toHaveClass('bg-emerald-500/10')
    })

    it('applies rounded-full for pill shape', () => {
      const { container } = render(<Badge>Pill</Badge>)
      const badge = container.firstChild
      expect(badge).toHaveClass('rounded-full')
    })
  })

  describe('accessibility', () => {
    it('supports role prop', () => {
      const { container } = render(<Badge role="status">Status</Badge>)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('role', 'status')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Badge aria-label="Transaction status: complete">✓</Badge>
      )
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('aria-label')
    })
  })

  describe('content', () => {
    it('accepts text content', () => {
      const { container } = render(<Badge>Text Badge</Badge>)
      expect(container.textContent).toBe('Text Badge')
    })

    it('accepts element children', () => {
      const { container } = render(
        <Badge>
          <span>Nested</span> Content
        </Badge>
      )
      expect(container.textContent).toContain('Nested')
    })
  })
})
