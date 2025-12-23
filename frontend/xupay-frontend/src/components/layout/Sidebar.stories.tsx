import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import {
  Home,
  Wallet,
  ArrowRightLeft,
  Settings,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const mockNavItems = [
  { label: "Dashboard", href: "/app/dashboard", icon: Home },
  { label: "Wallets", href: "/app/wallets", icon: Wallet },
  { label: "Transfers", href: "/app/transfers", icon: ArrowRightLeft },
  { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export const Default: Story = {
  args: {
    navItems: mockNavItems,
    isOpen: true,
    userEmail: "user@example.com",
  },
};

export const Closed: Story = {
  args: {
    navItems: mockNavItems,
    isOpen: false,
    userEmail: "user@example.com",
  },
};

export const WithoutEmail: Story = {
  args: {
    navItems: mockNavItems,
    isOpen: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Sidebar
        navItems={mockNavItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userEmail="user@example.com"
        onThemeToggle={() => {}}
        onLogout={() => {}}
      />
    );
  },
};

export const DarkMode: Story = {
  args: {
    navItems: mockNavItems,
    isOpen: true,
    userEmail: "user@example.com",
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const MobileOpen: Story = {
  args: {
    navItems: mockNavItems,
    isOpen: true,
    userEmail: "user@example.com",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const MobileClosed: Story = {
  args: {
    navItems: mockNavItems,
    isOpen: false,
    userEmail: "user@example.com",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const LongNavigation: Story = {
  args: {
    navItems: [
      ...mockNavItems,
      { label: "Audit Logs", href: "/app/audit", icon: BarChart3 },
      { label: "Users", href: "/app/users", icon: Wallet },
      { label: "Reports", href: "/app/reports", icon: Home },
      { label: "Security", href: "/app/security", icon: Settings },
    ],
    isOpen: true,
    userEmail: "user@example.com",
  },
};
