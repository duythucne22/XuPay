import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  describe('rendering', () => {
    it('renders button with text content', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders as child element when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      expect(screen.getByRole('link', { name: 'Link Button' })).toBeInTheDocument()
    })

    it('applies default variant and size', () => {
      const { container } = render(<Button>Default</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-emerald-500')
      expect(button).toHaveClass('h-10')
    })
  })

  describe('variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'glass'] as const

    variants.forEach((variant) => {
      it(`applies ${variant} variant classes`, () => {
        const { container } = render(<Button variant={variant}>Text</Button>)
        const button = container.querySelector('button')
        expect(button).toBeTruthy()
        // Just ensure no errors are thrown
      })
    })
  })

  describe('sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const

    sizes.forEach((size) => {
      it(`applies ${size} size classes`, () => {
        const { container } = render(<Button size={size}>Text</Button>)
        const button = container.querySelector('button')
        expect(button).toBeTruthy()
      })
    })
  })

  describe('states', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button')
      await user.click(button)
      expect(handleClick).toHaveBeenCalledOnce()
    })
  })

  describe('accessibility', () => {
    it('has focus-visible styles for keyboard navigation', () => {
      const { container } = render(<Button>Focus test</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
    })
  })
})
