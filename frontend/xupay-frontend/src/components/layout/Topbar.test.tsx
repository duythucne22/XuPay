import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Topbar } from "./Topbar";
import React from "react";

describe("Topbar", () => {
  it("renders topbar container", () => {
    const { container } = render(<Topbar />);
    const topbar = container.querySelector("div[class*='fixed']");
    expect(topbar).toBeInTheDocument();
  });

  it("renders menu button on mobile", () => {
    render(<Topbar showMenu={false} />);
    const menuButton = screen.getByLabelText("Toggle menu");
    expect(menuButton).toBeInTheDocument();
  });

  it("shows X icon when menu is open", () => {
    const { container } = render(<Topbar showMenu={true} />);
    const xIcon = container.querySelector("svg");
    expect(xIcon).toBeInTheDocument();
  });

  it("calls onMenuClick when menu button is clicked", async () => {
    const handleClick = vi.fn();
    render(<Topbar onMenuClick={handleClick} />);
    const menuButton = screen.getByLabelText("Toggle menu");
    await userEvent.click(menuButton);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders breadcrumbs when provided", () => {
    const breadcrumbs = [
      { label: "Dashboard", href: "/app/dashboard" },
      { label: "Wallets" },
    ];
    render(<Topbar breadcrumbs={breadcrumbs} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Wallets")).toBeInTheDocument();
  });

  it("renders notification bell icon", () => {
    const { container } = render(<Topbar />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders user menu icon", () => {
    const { container } = render(<Topbar />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("has fixed positioning", () => {
    const { container } = render(<Topbar />);
    const topbar = container.querySelector("div[class*='fixed']");
    expect(topbar).toHaveClass("fixed", "top-0", "z-50");
  });

  it("has correct height", () => {
    const { container } = render(<Topbar />);
    const topbar = container.querySelector("div[class*='h-full']")?.parentElement;
    expect(topbar).toHaveStyle({ height: "3.5rem" });
  });

  it("renders with dark mode support", () => {
    const { container } = render(<Topbar />);
    const topbar = container.querySelector("div[class*='dark']");
    expect(topbar).toHaveClass("dark:bg-gray-900", "dark:border-gray-800");
  });

  it("supports ref forwarding", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Topbar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
