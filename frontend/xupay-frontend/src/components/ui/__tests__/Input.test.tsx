import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from '../Input'

describe('Input', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('accepts type prop', () => {
      const { container } = render(<Input type="password" />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('applies default styling classes', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('rounded-xl')
      expect(input).toHaveClass('border')
      expect(input).toHaveClass('bg-black/20')
    })
  })

  describe('props', () => {
    it('accepts placeholder text', () => {
      render(<Input placeholder="Enter email" />)
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    })

    it('accepts value and onChange', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Input value="test" onChange={handleChange} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('test')

      await user.type(input, 'more')
      expect(handleChange).toHaveBeenCalled()
    })

    it('accepts disabled state', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('accessibility', () => {
    it('has focus-visible styles', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('focus-visible:outline-none')
      expect(input).toHaveClass('focus-visible:ring-1')
    })

    it('supports aria-label', () => {
      render(<Input aria-label="Email address" type="email" />)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(<Input aria-describedby="error-message" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'error-message')
    })
  })

  describe('types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const

    types.forEach((type) => {
      it(`supports type="${type}"`, () => {
        const { container } = render(<Input type={type} />)
        const input = container.querySelector('input')
        expect(input).toHaveAttribute('type', type)
      })
    })
  })
})
