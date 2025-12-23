import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "./Sidebar";
import { HomeIcon, WalletIcon } from "lucide-react";
import React from "react";

vi.mock("./NavLink", () => ({
  NavLink: ({ item }: any) => <a href={item.href}>{item.label}</a>,
}));

const mockNavItems = [
  { label: "Dashboard", href: "/app/dashboard", icon: HomeIcon },
  { label: "Wallets", href: "/app/wallets", icon: WalletIcon },
];

describe("Sidebar", () => {
  it("renders sidebar", () => {
    const { container } = render(
      <Sidebar navItems={mockNavItems} />
    );
    const sidebar = container.querySelector("[class*='fixed']");
    expect(sidebar).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(<Sidebar navItems={mockNavItems} />);
    expect(screen.getByText("XuPay")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(<Sidebar navItems={mockNavItems} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Wallets")).toBeInTheDocument();
  });

  it("hides sidebar on mobile when isOpen is false", () => {
    const { container } = render(
      <Sidebar navItems={mockNavItems} isOpen={false} />
    );
    const sidebar = container.querySelector("[class*='-translate-x-full']");
    expect(sidebar).toBeInTheDocument();
  });

  it("shows overlay when sidebar is open on mobile", () => {
    const { container } = render(
      <Sidebar navItems={mockNavItems} isOpen={true} />
    );
    const overlay = container.querySelector("[class*='bg-black']");
    expect(overlay).toBeInTheDocument();
  });

  it("calls onClose when overlay is clicked", async () => {
    const handleClose = vi.fn();
    render(
      <Sidebar navItems={mockNavItems} isOpen={true} onClose={handleClose} />
    );
    const overlay = screen.getByRole("presentation");
    await userEvent.click(overlay);
    expect(handleClose).toHaveBeenCalled();
  });

  it("renders user email", () => {
    render(
      <Sidebar navItems={mockNavItems} userEmail="user@example.com" />
    );
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  it("calls onThemeToggle when theme button is clicked", async () => {
    const handleThemeToggle = vi.fn();
    render(
      <Sidebar navItems={mockNavItems} onThemeToggle={handleThemeToggle} />
    );
    const themeButton = screen.getByLabelText("Toggle theme");
    await userEvent.click(themeButton);
    expect(handleThemeToggle).toHaveBeenCalled();
  });

  it("calls onLogout when logout button is clicked", async () => {
    const handleLogout = vi.fn();
    render(
      <Sidebar navItems={mockNavItems} onLogout={handleLogout} />
    );
    const logoutButton = screen.getByLabelText("Logout");
    await userEvent.click(logoutButton);
    expect(handleLogout).toHaveBeenCalled();
  });

  it("has correct height (100vh - header)", () => {
    const { container } = render(
      <Sidebar navItems={mockNavItems} />
    );
    const sidebar = container.querySelector("[style*='height']");
    expect(sidebar).toHaveStyle({
      height: "calc(100vh - 3.5rem)",
    });
  });

  it("supports dark mode", () => {
    const { container } = render(
      <Sidebar navItems={mockNavItems} />
    );
    const sidebar = container.querySelector("[class*='dark']");
    expect(sidebar).toHaveClass("dark:bg-gray-900", "dark:border-gray-800");
  });

  it("supports ref forwarding", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Sidebar ref={ref} navItems={mockNavItems} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders without nav items gracefully", () => {
    const { container } = render(<Sidebar navItems={[]} />);
    const sidebar = container.querySelector("[class*='flex-col']");
    expect(sidebar).toBeInTheDocument();
  });
});
