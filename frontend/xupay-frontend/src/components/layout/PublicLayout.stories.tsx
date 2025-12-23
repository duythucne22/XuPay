import type { Meta, StoryObj } from "@storybook/react";
import { PublicLayout } from "./PublicLayout";

const meta: Meta<typeof PublicLayout> = {
  title: "Layout/PublicLayout",
  component: PublicLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PublicLayout>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to XuPay
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Secure, fast, and reliable payment solutions for everyone.
          </p>
        </section>
      </div>
    ),
  },
};

export const WithHeroSection: Story = {
  args: {
    children: (
      <div className="space-y-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Payments Made Simple
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Fast, secure, and reliable payment processing for your business.
            </p>
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Get Started
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {i}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Feature {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Description of feature {i} goes here.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    ),
  },
};

export const DarkMode: Story = {
  args: {
    children: (
      <div className="bg-gray-900 min-h-screen">
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Dark Mode Preview
          </h1>
          <p className="text-lg text-gray-400">
            This layout supports dark mode.
          </p>
        </section>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

export const MobileView: Story = {
  args: {
    children: (
      <div>
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Mobile View
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Navigation is responsive on mobile devices.
          </p>
        </section>
      </div>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
