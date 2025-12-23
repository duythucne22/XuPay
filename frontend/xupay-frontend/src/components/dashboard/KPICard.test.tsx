import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KPICard } from "./KPICard";
import React from "react";

describe("KPICard", () => {
  it("renders label and value", () => {
    render(<KPICard label="Balance" value="$2,450.00" />);
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("$2,450.00")).toBeInTheDocument();
  });

  it("applies emerald color by default", () => {
    const { container } = render(<KPICard label="Test" value="100" />);
    const card = container.querySelector("[class*='bg-emerald']");
    expect(card).toHaveClass("bg-emerald-50");
  });

  it("applies blue color variant", () => {
    const { container } = render(<KPICard label="Test" value="100" color="blue" />);
    const card = container.querySelector("[class*='bg-blue']");
    expect(card).toHaveClass("bg-blue-50");
  });

  it("applies amber color variant", () => {
    const { container } = render(<KPICard label="Test" value="100" color="amber" />);
    const card = container.querySelector("[class*='bg-amber']");
    expect(card).toHaveClass("bg-amber-50");
  });

  it("applies red color variant", () => {
    const { container } = render(<KPICard label="Test" value="100" color="red" />);
    const card = container.querySelector("[class*='bg-red']");
    expect(card).toHaveClass("bg-red-50");
  });

  it("renders icon when provided", () => {
    const { container } = render(
      <KPICard label="Test" value="100" icon={<span data-testid="icon">💰</span>} />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders trend badge with up direction", () => {
    render(
      <KPICard
        label="Balance"
        value="$2,450.00"
        trend={{ direction: "up", percentage: 12 }}
      />
    );
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByText("Trending up")).toBeInTheDocument();
  });

  it("renders trend badge with down direction", () => {
    render(
      <KPICard
        label="Expenses"
        value="$500.00"
        trend={{ direction: "down", percentage: 5 }}
      />
    );
    expect(screen.getByText(/↓/)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
    expect(screen.getByText("Trending down")).toBeInTheDocument();
  });

  it("renders trend badge with neutral direction", () => {
    render(
      <KPICard
        label="Savings"
        value="$1,000.00"
        trend={{ direction: "neutral", percentage: 0 }}
      />
    );
    expect(screen.getByText(/→/)).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getByText("No change")).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    const { container } = render(<KPICard label="Loading" value="$0" isLoading />);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders numeric value correctly", () => {
    render(<KPICard label="Count" value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("supports custom className", () => {
    const { container } = render(
      <KPICard label="Test" value="100" className="custom-class" />
    );
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("custom-class");
  });

  it("renders without trend", () => {
    const { container } = render(<KPICard label="Balance" value="$2,450.00" />);
    const badge = container.querySelector("[class*='px-2']");
    expect(badge).not.toBeInTheDocument();
  });

  it("supports ref forwarding", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<KPICard ref={ref} label="Test" value="100" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with all props combined", () => {
    render(
      <KPICard
        label="Revenue"
        value="$5,234.50"
        icon={<span>📊</span>}
        color="emerald"
        trend={{ direction: "up", percentage: 23 }}
      />
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$5,234.50")).toBeInTheDocument();
    expect(screen.getByText("📊")).toBeInTheDocument();
    expect(screen.getByText(/23%/)).toBeInTheDocument();
  });
});
