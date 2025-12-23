import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NavLink } from "./NavLink";
import React from "react";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/app/dashboard",
}));

vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock icon component
const MockIcon = () => <span data-testid="icon">📊</span>;

const mockNavItem = {
  label: "Dashboard",
  href: "/app/dashboard",
  icon: MockIcon,
};

describe("NavLink", () => {
  it("renders navigation link with label", () => {
    render(<NavLink item={mockNavItem} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<NavLink item={mockNavItem} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies active state when pathname matches", () => {
    const { container } = render(<NavLink item={mockNavItem} />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("text-primary");
  });

  it("applies inactive state when pathname doesn't match", () => {
    render(<NavLink item={{ ...mockNavItem, href: "/app/wallets" }} />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveClass("text-primary");
  });

  it("hides label when collapsed", () => {
    const { container } = render(<NavLink item={mockNavItem} collapsed />);
    const link = container.querySelector("a");
    // When collapsed, label should still be in DOM but with collapsed styles
    expect(link).toHaveClass("justify-center");
  });

  it("shows title attribute when collapsed", () => {
    render(<NavLink item={mockNavItem} collapsed />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("title", "Dashboard");
  });

  it("supports hover state", () => {
    const { container } = render(<NavLink item={mockNavItem} />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("hover:bg-muted/40", "hover:text-foreground");
  });

  it("supports focus state", () => {
    const { container } = render(<NavLink item={mockNavItem} />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("focus-visible:ring-2");
  });

  it("has correct href attribute", () => {
    render(<NavLink item={mockNavItem} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/app/dashboard");
  });

  it("applies collapsed styles", () => {
    const { container } = render(<NavLink item={mockNavItem} collapsed />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("px-2");
  });

  it("applies normal styles when not collapsed", () => {
    const { container } = render(<NavLink item={mockNavItem} />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("px-3");
  });

  it("renders with different navigation items", () => {
    const walletItem = { ...mockNavItem, label: "Wallets", href: "/app/wallets" };
    render(<NavLink item={walletItem} />);
    expect(screen.getByText("Wallets")).toBeInTheDocument();
  });

  it("maintains accessibility with proper link semantics", () => {
    render(<NavLink item={mockNavItem} />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });
});
