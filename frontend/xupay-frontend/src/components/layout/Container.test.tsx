import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  beforeEach(() => {
    // Clear any previous renders
  })

  describe('rendering', () => {
    it('renders children correctly', () => {
      render(
        <Container>
          <div data-testid="test-child">Hello Container</div>
        </Container>
      )

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
      expect(screen.getByText('Hello Container')).toBeInTheDocument()
    })

    it('applies default size (lg) and base classes', () => {
      const { container } = render(
        <Container>
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('max-w-7xl')
      expect(wrapper).toHaveClass('mx-auto')
      expect(wrapper).toHaveClass('px-4')
    })
  })

  describe('size prop', () => {
    it('applies sm size class', () => {
      const { container } = render(
        <Container size="sm">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('max-w-md')
    })

    it('applies md size class', () => {
      const { container } = render(
        <Container size="md">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('max-w-2xl')
    })

    it('applies lg size class (default)', () => {
      const { container } = render(
        <Container size="lg">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('max-w-7xl')
    })

    it('applies xl size class', () => {
      const { container } = render(
        <Container size="xl">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('max-w-8xl')
    })

    it('applies full size class', () => {
      const { container } = render(
        <Container size="full">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('max-w-full')
    })
  })

  describe('custom className', () => {
    it('merges custom className with default classes', () => {
      const { container } = render(
        <Container className="custom-class bg-red-500">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
      expect(wrapper).toHaveClass('bg-red-500')
      expect(wrapper).toHaveClass('max-w-7xl')
    })

    it('allows Tailwind class overrides via cn function', () => {
      const { container } = render(
        <Container size="md" className="px-2">
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      // twMerge should handle conflicting padding classes
      expect(wrapper).toHaveClass('max-w-2xl')
      expect(wrapper).toHaveClass('px-2')
    })
  })

  describe('responsive padding', () => {
    it('includes responsive padding classes', () => {
      const { container } = render(
        <Container>
          <div>Content</div>
        </Container>
      )

      const wrapper = container.firstChild as HTMLElement
      // Check for responsive padding classes
      expect(wrapper.className).toContain('px-4')
      expect(wrapper.className).toContain('sm:px-6')
      expect(wrapper.className).toContain('lg:px-8')
    })
  })

  describe('client-side rendering', () => {
    it('works as a client component', () => {
      const { container } = render(
        <Container>
          <div>Client Content</div>
        </Container>
      )

      expect(container).toBeTruthy()
      expect(screen.getByText('Client Content')).toBeInTheDocument()
    })
  })
})
