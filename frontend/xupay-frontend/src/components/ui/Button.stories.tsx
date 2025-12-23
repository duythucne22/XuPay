import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default button with emerald gradient and hover effects.
 * Primary action button for main CTAs.
 */
export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
}

/**
 * Destructive button for dangerous actions (delete, etc.).
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

/**
 * Outline button for secondary actions.
 */
export const Outline: Story = {
  args: {
    children: 'Learn more',
    variant: 'outline',
  },
}

/**
 * Secondary button with glass effect.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

/**
 * Ghost button — minimal styling, hover only.
 */
export const Ghost: Story = {
  args: {
    children: 'Cancel',
    variant: 'ghost',
  },
}

/**
 * Link-styled button for inline links.
 */
export const Link: Story = {
  args: {
    children: 'Read more →',
    variant: 'link',
  },
}

/**
 * Glass effect button with frosted appearance.
 */
export const Glass: Story = {
  args: {
    children: 'Glass Button',
    variant: 'glass',
  },
}

/**
 * Small button size.
 */
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

/**
 * Large button size — use for prominent CTAs.
 */
export const Large: Story = {
  args: {
    children: 'Get Started',
    size: 'lg',
  },
}

/**
 * Icon button — square shape for icon-only content.
 */
export const Icon: Story = {
  args: {
    children: '×',
    size: 'icon',
  },
}

/**
 * Disabled button state.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

/**
 * Loading state with disabled styling.
 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
  },
}

/**
 * Multiple buttons in a row (typical form actions).
 */
export const Group: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="outline">Cancel</Button>
      <Button>Submit</Button>
    </div>
  ),
}

/**
 * All size variants together.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">✓</Button>
    </div>
  ),
}
