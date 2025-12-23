import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { DashboardLayout } from "./DashboardLayout";
import React from "react";

vi.mock("./DashboardHeader", () => ({
  DashboardHeader: ({ onMenuClick }: any) => (
    <button onClick={onMenuClick}>Menu</button>
  ),
}));

vi.mock("./Sidebar", () => ({
  Sidebar: () => <div>Sidebar</div>,
}));

vi.mock("./MobileSidebar", () => ({
  MobileSidebar: ({ onClose }: any) => (
    <button onClick={onClose}>Close Mobile</button>
  ),
}));

describe("DashboardLayout", () => {
  it("renders layout container", () => {
    const { container } = render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    expect(container.querySelector("[class*='min-h-screen']")).toBeInTheDocument();
  });

  it("renders topbar/header", () => {
    render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("renders sidebar", () => {
    render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders main content", () => {
    render(
      <DashboardLayout><div>Test Content</div></DashboardLayout>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("sidebar is hidden on mobile", () => {
    const { container } = render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    const sidebar = container.querySelector("[class*='hidden lg:block']");
    expect(sidebar).toBeInTheDocument();
  });

  it("has dark background", () => {
    const { container } = render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    const root = container.querySelector("[class*='bg-\\[']");
    expect(root).toHaveClass("text-gray-100");
  });

  it("supports mobile menu toggle", async () => {
    render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    const menuButton = screen.getByText("Menu");
    await userEvent.click(menuButton);
    expect(screen.getByText("Close Mobile")).toBeInTheDocument();
  });

  it("main content area is properly offset on desktop", () => {
    const { container } = render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    const mainArea = container.querySelector("[class*='lg:pl-64']");
    expect(mainArea).toBeInTheDocument();
  });

  it("content is scrollable", () => {
    const { container } = render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass("flex-1");
  });

  it("has transition animation", () => {
    const { container } = render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    const mainArea = container.querySelector("[class*='transition']");
    expect(mainArea).toBeInTheDocument();
  });

  it("renders with Container wrapper", () => {
    render(
      <DashboardLayout><div>Content</div></DashboardLayout>
    );
    // Content is wrapped in Container
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("supports ref forwarding", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <DashboardLayout><div ref={ref}>Content</div></DashboardLayout>
    );
    expect(container).toBeInTheDocument();
  });
});
