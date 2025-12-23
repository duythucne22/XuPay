import type { Meta, StoryObj } from "@storybook/react";
import { AuthLayout } from "./AuthLayout";

const meta: Meta<typeof AuthLayout> = {
  title: "Layout/AuthLayout",
  component: AuthLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

export const LoginForm: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
          >
            Sign In
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    ),
  },
};

export const RegisterForm: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get started with XuPay in seconds
          </p>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First name"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder="Last name"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    ),
  },
};

export const DarkMode: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-4">Dark Mode Preview</h1>
        <p className="text-gray-300">This layout supports dark mode seamlessly.</p>
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
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Mobile Layout
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Form takes full width on mobile devices.
        </p>
      </div>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const DesktopView: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Desktop Split View
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Form is centered on the left, hero gradient on the right.
        </p>
      </div>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
};
