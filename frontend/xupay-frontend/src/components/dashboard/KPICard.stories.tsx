import type { Meta, StoryObj } from "@storybook/react";
import { KPICard } from "./KPICard";

const meta: Meta<typeof KPICard> = {
  title: "Dashboard/KPICard",
  component: KPICard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {
    label: "Total Balance",
    value: "$12,450.50",
    color: "emerald",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Total Income",
    value: "$45,230.00",
    icon: "💰",
    color: "emerald",
  },
};

export const TrendingUp: Story = {
  args: {
    label: "Monthly Growth",
    value: "$5,234.50",
    icon: "📈",
    color: "emerald",
    trend: { direction: "up", percentage: 12 },
  },
};

export const TrendingDown: Story = {
  args: {
    label: "Expenses",
    value: "$2,100.00",
    icon: "📉",
    color: "red",
    trend: { direction: "down", percentage: 8 },
  },
};

export const BlueVariant: Story = {
  args: {
    label: "Active Users",
    value: "1,234",
    icon: "👥",
    color: "blue",
    trend: { direction: "up", percentage: 23 },
  },
};

export const AmberVariant: Story = {
  args: {
    label: "Pending Tasks",
    value: "42",
    icon: "⚠️",
    color: "amber",
    trend: { direction: "neutral", percentage: 0 },
  },
};

export const RedVariant: Story = {
  args: {
    label: "Failed Transactions",
    value: "5",
    icon: "❌",
    color: "red",
    trend: { direction: "down", percentage: 15 },
  },
};

export const Loading: Story = {
  args: {
    label: "Loading...",
    value: "$0",
    isLoading: true,
  },
};

export const LargeNumber: Story = {
  args: {
    label: "Total Revenue",
    value: "$1,234,567.89",
    icon: "💵",
    color: "emerald",
    trend: { direction: "up", percentage: 34 },
  },
};

export const NoTrend: Story = {
  args: {
    label: "Static Balance",
    value: "$3,500.00",
    color: "blue",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Total Balance"
        value="$12,450.50"
        icon="💰"
        color="emerald"
        trend={{ direction: "up", percentage: 12 }}
      />
      <KPICard
        label="Monthly Income"
        value="$5,234.50"
        icon="📈"
        color="blue"
        trend={{ direction: "up", percentage: 23 }}
      />
      <KPICard
        label="Total Expenses"
        value="$2,100.00"
        icon="📉"
        color="amber"
        trend={{ direction: "down", percentage: 8 }}
      />
      <KPICard
        label="Pending Orders"
        value="42"
        icon="📦"
        color="red"
        trend={{ direction: "neutral", percentage: 0 }}
      />
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    label: "Dark Mode Balance",
    value: "$12,450.50",
    icon: "🌙",
    color: "emerald",
    trend: { direction: "up", percentage: 12 },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
