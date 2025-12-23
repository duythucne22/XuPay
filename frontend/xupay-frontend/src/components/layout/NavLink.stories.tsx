import type { Meta, StoryObj } from "@storybook/react";
import { NavLink } from "./NavLink";
import { HomeIcon, WalletIcon, ArrowRightLeft, Settings } from "lucide-react";

const meta: Meta<typeof NavLink> = {
  title: "Layout/NavLink",
  component: NavLink,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NavLink>;

const mockNavItem = {
  label: "Dashboard",
  href: "/app/dashboard",
  icon: HomeIcon,
};

export const Default: Story = {
  args: {
    item: mockNavItem,
  },
};

export const Active: Story = {
  args: {
    item: mockNavItem,
  },
  decorators: [
    (Story) => (
      <div>
        <p className="text-sm text-gray-600 mb-2">Active state (matches current path)</p>
        <Story />
      </div>
    ),
  ],
};

export const Inactive: Story = {
  args: {
    item: {
      label: "Wallets",
      href: "/app/wallets",
      icon: WalletIcon,
    },
  },
};

export const Collapsed: Story = {
  args: {
    item: mockNavItem,
    collapsed: true,
  },
};

export const CollapsedMultiple: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-20">
      <NavLink item={{ label: "Dashboard", href: "/app/dashboard", icon: HomeIcon }} collapsed />
      <NavLink item={{ label: "Wallets", href: "/app/wallets", icon: WalletIcon }} collapsed />
      <NavLink item={{ label: "Transfers", href: "/app/transfers", icon: ArrowRightLeft }} collapsed />
      <NavLink item={{ label: "Settings", href: "/app/settings", icon: Settings }} collapsed />
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100">
      <div className="flex items-center gap-3">
        <HomeIcon className="w-5 h-5" />
        <span>Notifications</span>
      </div>
      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
        3
      </span>
    </div>
  ),
};

export const NavMenu: Story = {
  render: () => (
    <nav className="flex flex-col gap-1 w-56">
      <p className="text-xs font-semibold text-gray-600 px-3 py-2 uppercase">Navigation</p>
      <NavLink item={{ label: "Dashboard", href: "/app/dashboard", icon: HomeIcon }} />
      <NavLink item={{ label: "Wallets", href: "/app/wallets", icon: WalletIcon }} />
      <NavLink item={{ label: "Transfers", href: "/app/transfers", icon: ArrowRightLeft }} />
      <div className="my-2 border-t border-gray-200"></div>
      <p className="text-xs font-semibold text-gray-600 px-3 py-2 uppercase">Account</p>
      <NavLink item={{ label: "Settings", href: "/app/settings", icon: Settings }} />
    </nav>
  ),
};

export const Hover: Story = {
  args: {
    item: {
      label: "Hover me",
      href: "/app/hover",
      icon: HomeIcon,
    },
  },
  decorators: [
    (Story) => (
      <div>
        <p className="text-sm text-gray-600 mb-2">Try hovering over this link</p>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    item: mockNavItem,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const SidebarExample: Story = {
  render: () => (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <div className="mb-8">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">XuPay</h2>
      </div>
      <nav className="space-y-2">
        <NavLink item={{ label: "Dashboard", href: "/app/dashboard", icon: HomeIcon }} />
        <NavLink item={{ label: "Wallets", href: "/app/wallets", icon: WalletIcon }} />
        <NavLink item={{ label: "Transfers", href: "/app/transfers", icon: ArrowRightLeft }} />
        <NavLink item={{ label: "Settings", href: "/app/settings", icon: Settings }} />
      </nav>
    </aside>
  ),
};
