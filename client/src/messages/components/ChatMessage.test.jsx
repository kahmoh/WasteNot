import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatMessage from "./ChatMessage";
import React from "react";

describe("ChatMessage", () => {
  it("renders a user message with correct text", () => {
    render(<ChatMessage role="user" message="Hello there" />);
    const msg = screen.getByText("Hello there");
    expect(msg).toBeInTheDocument();
    expect(msg.className).toMatch(/chat-message-user/);
  });

  it("renders a non-user (other) message with correct text", () => {
    render(<ChatMessage role="other" message="Hi!" />);
    const msg = screen.getByText("Hi!");
    expect(msg).toBeInTheDocument();
    expect(msg.className).toMatch(/chat-message-other/);
  });
});
