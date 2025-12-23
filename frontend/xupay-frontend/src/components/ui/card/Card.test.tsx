import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders card with content", () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("bg-white", "border-gray-200");
  });

  it("applies hover variant", () => {
    const { container } = render(<Card variant="hover">Hover Card</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("hover:shadow-lg", "hover:border-gray-300");
  });

  it("applies glass variant", () => {
    const { container } = render(<Card variant="glass">Glass Card</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("bg-white/10", "backdrop-blur-md", "border-white/20");
  });

  it("applies interactive variant", () => {
    const { container } = render(<Card variant="interactive">Interactive Card</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("cursor-pointer", "hover:bg-gray-50");
  });

  it("applies elevated variant", () => {
    const { container } = render(<Card variant="elevated">Elevated Card</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("shadow-sm", "hover:shadow-lg");
  });

  it("applies outlined variant", () => {
    const { container } = render(<Card variant="outlined">Outlined Card</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("bg-transparent", "border-gray-300");
  });

  it("applies flat variant", () => {
    const { container } = render(<Card variant="flat">Flat Card</Card>);
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("bg-gray-50", "border-transparent");
  });

  it("supports custom className merging", () => {
    const { container } = render(
      <Card className="custom-class">Custom Card</Card>
    );
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("custom-class", "p-6");
  });

  it("works with dark mode", () => {
    const { container } = render(
      <Card className="dark">Dark Card</Card>
    );
    const card = container.querySelector("[class*='rounded-xl']");
    expect(card).toHaveClass("dark:bg-gray-900", "dark:border-gray-800");
  });

  it("supports ref forwarding", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders nested elements correctly", () => {
    render(
      <Card>
        <h3>Title</h3>
        <p>Description</p>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});

import React from "react";
