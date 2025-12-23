import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { AuthLayout } from "./AuthLayout";
import React from "react";

describe("AuthLayout", () => {
  it("renders layout container", () => {
    const { container } = render(
      <AuthLayout><div>Form</div></AuthLayout>
    );
    expect(container.querySelector("[class*='min-h-screen']")).toBeInTheDocument();
  });

  it("renders children form content", () => {
    render(
      <AuthLayout><div>Login Form</div></AuthLayout>
    );
    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });

  it("centers form content", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const formContainer = container.querySelector("[class*='items-center justify-center']");
    expect(formContainer).toBeInTheDocument();
  });

  it("limits form max-width to max-w-md", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const formWrapper = container.querySelector("[class*='max-w-md']");
    expect(formWrapper).toBeInTheDocument();
  });

  it("hides hero on mobile", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const hero = container.querySelector("[class*='hidden md:flex']");
    expect(hero).toBeInTheDocument();
  });

  it("renders hero with gradient background on desktop", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const hero = container.querySelector("[class*='bg-gradient-to-br']");
    expect(hero).toHaveClass("from-emerald-600", "to-emerald-800");
  });

  it("displays welcome message in hero", () => {
    render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    expect(screen.getByText("Welcome to XuPay")).toBeInTheDocument();
  });

  it("has responsive layout (flex-col on mobile, flex-row on desktop)", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const layoutContainer = container.querySelector("[class*='flex-col md:flex-row']");
    expect(layoutContainer).toBeInTheDocument();
  });

  it("supports dark mode", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const leftSide = container.querySelector("[class*='dark:bg-gray-900']");
    expect(leftSide).toBeInTheDocument();
  });

  it("form area has proper padding", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const leftSide = container.querySelector("[class*='px-4']");
    expect(leftSide).toHaveClass("px-4", "py-8");
  });

  it("has correct min-height for full viewport", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const root = container.querySelector("[class*='min-h-screen']");
    expect(root).toHaveClass("min-h-screen");
  });

  it("hero displays security icon", () => {
    const { container } = render(
      <AuthLayout><div>Content</div></AuthLayout>
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
