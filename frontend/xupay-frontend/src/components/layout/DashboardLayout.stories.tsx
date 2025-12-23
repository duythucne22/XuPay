import type { Meta, StoryObj } from "@storybook/react";
import { DashboardLayout } from "./DashboardLayout";

const meta: Meta<typeof DashboardLayout> = {
  title: "Layout/DashboardLayout",
  component: DashboardLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-8">
        <section>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your dashboard
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-800 bg-gray-800/50 text-gray-900 dark:text-white"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Card {i}
              </p>
              <p className="text-2xl font-bold">$0.00</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Dashboard with Long Content
        </h1>

        {Array.from({ length: 5 }).map((_, i) => (
          <section key={i} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Section {i + 1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  className="p-4 rounded-lg border border-gray-800 bg-gray-800/30 text-gray-400"
                >
                  Item {j + 1}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    ),
  },
};

export const Mobile: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Mobile Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Sidebar is hidden on mobile, tap menu to toggle.
        </p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-800 bg-gray-800/30"
            >
              Card {i}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Tablet: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Tablet View</h1>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-gray-800 bg-gray-800/30 text-gray-400"
            >
              Card {i + 1}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "ipad" },
  },
};

export const DarkMode: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dark Mode Dashboard</h1>
        <p className="text-gray-400">
          This layout is optimized for dark theme.
        </p>
      </div>
    ),
  },
};
