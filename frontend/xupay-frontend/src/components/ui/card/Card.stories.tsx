import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Default Card</h3>
        <p className="text-gray-600 text-sm">
          This is a default card with standard styling.
        </p>
      </div>
    ),
  },
};

export const Hover: Story = {
  args: {
    variant: "hover",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Hover Card</h3>
        <p className="text-gray-600 text-sm">
          This card has enhanced hover effects with shadow.
        </p>
      </div>
    ),
  },
};

export const Glass: Story = {
  args: {
    variant: "glass",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Glass Card</h3>
        <p className="text-gray-600 text-sm">
          This card uses glass-morphism effect with backdrop blur.
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  args: {
    variant: "interactive",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Interactive Card</h3>
        <p className="text-gray-600 text-sm">
          Click this card for interactive behavior.
        </p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Elevated Card</h3>
        <p className="text-gray-600 text-sm">
          This card has subtle shadow elevation.
        </p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Outlined Card</h3>
        <p className="text-gray-600 text-sm">
          This card uses only border without background fill.
        </p>
      </div>
    ),
  },
};

export const Flat: Story = {
  args: {
    variant: "flat",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Flat Card</h3>
        <p className="text-gray-600 text-sm">
          This card has a subtle background without border emphasis.
        </p>
      </div>
    ),
  },
};

export const WithChildren: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Card with Rich Content</h2>
        <p className="text-gray-600">
          Cards can contain various types of content including text, images, and forms.
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">
            Action 1
          </button>
          <button className="px-3 py-1.5 border border-gray-300 text-gray-900 rounded-md text-sm">
            Action 2
          </button>
        </div>
      </div>
    ),
  },
};

export const DarkMode: Story = {
  args: {
    className: "dark",
    children: (
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Dark Mode Card</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          This card adapts to dark theme automatically.
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const Responsive: Story = {
  args: {
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Section 1</h4>
          <p className="text-gray-600 text-sm">Responsive content area 1.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Section 2</h4>
          <p className="text-gray-600 text-sm">Responsive content area 2.</p>
        </div>
      </div>
    ),
  },
};

export const WithCustomStyling: Story = {
  args: {
    className: "border-2 border-emerald-500 bg-emerald-50",
    children: (
      <div>
        <h3 className="font-semibold text-emerald-900 mb-2">Custom Styled Card</h3>
        <p className="text-emerald-700 text-sm">
          This card demonstrates custom className prop merging.
        </p>
      </div>
    ),
  },
};
