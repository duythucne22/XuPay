import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Text input — default type for general text entry.
 */
export const Text: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
}

/**
 * Email input with email-specific validation.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
  },
}

/**
 * Password input — hides characters.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
}

/**
 * Number input for numeric values.
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
}

/**
 * Telephone input for phone numbers.
 */
export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
  },
}

/**
 * URL input for web addresses.
 */
export const URL: Story = {
  args: {
    type: 'url',
    placeholder: 'https://example.com',
  },
}

/**
 * Disabled input state.
 */
export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit',
  },
}

/**
 * Input with value and aria-label.
 */
export const WithValue: Story = {
  args: {
    type: 'text',
    value: 'Prefilled value',
    'aria-label': 'Username',
  },
}

/**
 * Form layout with multiple inputs (typical registration form).
 */
export const FormLayout: Story = {
  render: () => (
    <form className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Email</label>
        <Input type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Password</label>
        <Input type="password" placeholder="Min 8 characters" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">First Name</label>
        <Input type="text" placeholder="John" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Last Name</label>
        <Input type="text" placeholder="Doe" />
      </div>
    </form>
  ),
}

/**
 * Focus state demonstration.
 */
export const Focused: Story = {
  args: {
    type: 'text',
    placeholder: 'Focus to see ring effect',
    autoFocus: true,
  },
}

/**
 * Input with error styling (visual only).
 */
export const WithError: Story = {
  args: {
    type: 'email',
    placeholder: 'Invalid email',
    value: 'not-an-email',
    'aria-invalid': true,
    'aria-describedby': 'email-error',
  },
}
