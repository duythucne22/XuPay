import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Container with `size="lg"` (max-w-7xl).
 * Used for most dashboard and page content per spec.md.
 */
export const DefaultLarge: Story = {
  args: {
    children: (
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-lg border border-indigo-200">
        <h2 className="text-lg font-semibold text-indigo-900 mb-2">
          Container (lg) — Default
        </h2>
        <p className="text-sm text-indigo-700">
          max-w-7xl (1280px), used for dashboard main content areas
        </p>
      </div>
    ),
  },
}

/**
 * Small Container with `size="sm"` (max-w-md).
 * Used for centered forms (login, register).
 */
export const SmallForm: Story = {
  args: {
    size: 'sm',
    children: (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">
          Container (sm) — Forms
        </h2>
        <p className="text-sm text-purple-700">
          max-w-md (448px), used for centered form layouts
        </p>
      </div>
    ),
  },
}

/**
 * Medium Container with `size="md"` (max-w-2xl).
 * Used for narrow content areas.
 */
export const MediumNarrow: Story = {
  args: {
    size: 'md',
    children: (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          Container (md) — Narrow
        </h2>
        <p className="text-sm text-green-700">
          max-w-2xl (672px), used for narrow or single-column content
        </p>
      </div>
    ),
  },
}

/**
 * Extra-Large Container with `size="xl"` (max-w-8xl).
 * Used for hero sections and full-width content.
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg border border-orange-200">
        <h2 className="text-lg font-semibold text-orange-900 mb-2">
          Container (xl) — Hero
        </h2>
        <p className="text-sm text-orange-700">
          max-w-8xl (1408px), used for hero sections and wide layouts
        </p>
      </div>
    ),
  },
}

/**
 * Full-Width Container with `size="full"`.
 * No max-width constraint, 100% viewport width (minus padding).
 */
export const FullWidth: Story = {
  args: {
    size: 'full',
    children: (
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-lg border border-cyan-200">
        <h2 className="text-lg font-semibold text-cyan-900 mb-2">
          Container (full) — Full Width
        </h2>
        <p className="text-sm text-cyan-700">
          max-w-full (100%), used for sections without width constraints
        </p>
      </div>
    ),
  },
}

/**
 * With custom className override.
 * Demonstrates className merging with Tailwind classes.
 */
export const WithCustomClass: Story = {
  args: {
    size: 'lg',
    className: 'bg-white shadow-lg rounded-xl p-6',
    children: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Container with Custom Class
        </h2>
        <p className="text-sm text-gray-600">
          Custom classes are merged using the cn() helper (clsx + twMerge).
        </p>
        <div className="bg-gray-100 p-4 rounded text-xs font-mono text-gray-700">
          className=&quot;bg-white shadow-lg rounded-xl p-6&quot;
        </div>
      </div>
    ),
  },
}

/**
 * Responsive sizing demonstration.
 * Shows how padding adjusts responsively.
 */
export const ResponsivePadding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Container applies responsive padding: px-4 (mobile), sm:px-6 (tablet), lg:px-8 (desktop)',
      },
    },
  },
  args: {
    size: 'lg',
    children: (
      <div className="space-y-4">
        <div className="bg-indigo-50 border-2 border-indigo-300 p-4 rounded">
          <p className="text-xs font-mono text-indigo-900">
            📱 Mobile (px-4): 16px padding
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
          <p className="text-xs font-mono text-blue-900">
            📘 Tablet (sm:px-6): 24px padding
          </p>
        </div>
        <div className="bg-cyan-50 border-2 border-cyan-300 p-4 rounded">
          <p className="text-xs font-mono text-cyan-900">
            🖥️ Desktop (lg:px-8): 32px padding
          </p>
        </div>
      </div>
    ),
  },
}
