import type { Meta, StoryObj } from "@storybook/react";
import { Topbar } from "./Topbar";
import { useState } from "react";

const meta: Meta<typeof Topbar> = {
  title: "Layout/Topbar",
  component: Topbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Topbar>;

export const Default: Story = {
  args: {
    showMenu: false,
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "Wallets", href: "/app/wallets" },
      { label: "Wallet Details" },
    ],
    showMenu: false,
  },
};

export const MenuOpen: Story = {
  args: {
    showMenu: true,
    breadcrumbs: [{ label: "Dashboard" }],
  },
};

export const Interactive: Story = {
  render: () => {
    const [showMenu, setShowMenu] = useState(false);
    return (
      <Topbar
        showMenu={showMenu}
        onMenuClick={() => setShowMenu(!showMenu)}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Current Page" },
        ]}
      />
    );
  },
};

export const DarkMode: Story = {
  args: {
    breadcrumbs: [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "Analytics" },
    ],
    showMenu: false,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 p-8 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const WithLongBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "Wallets", href: "/app/wallets" },
      { label: "Wallet Details", href: "/app/wallets/1" },
      { label: "Transaction" },
    ],
    showMenu: false,
  },
};

export const MobileView: Story = {
  args: {
    breadcrumbs: [{ label: "Dashboard" }],
    showMenu: false,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
