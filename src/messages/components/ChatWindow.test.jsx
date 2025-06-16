import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatWindow from "./ChatWindow";
import React from "react";

// Mock dependencies
vi.mock("./ChatMessage", () => ({
  default: ({ message, role }) => (
    <div data-testid="chat-message" data-role={role}>
      {message}
    </div>
  ),
}));

vi.mock("./MessageInput", () => ({
  default: () => <div data-testid="message-input">Input Area</div>,
}));

const mockMessages = [
  { text: "Hello!", role: "user" },
  { text: "Hi, how can I help?", role: "other" },
];

describe("ChatWindow", () => {
  it("renders profile picture and name", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={[]} />);

    const image = screen.getByAltText("Profile Picture");
    expect(image).toHaveAttribute("src", "/profile.jpg");

    expect(screen.getByText("Marcus")).toBeInTheDocument();
  });

  it("renders all chat messages", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={mockMessages} />);

    const messages = screen.getAllByTestId("chat-message");
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent("Hello!");
    expect(messages[1]).toHaveTextContent("Hi, how can I help?");
    expect(messages[0]).toHaveAttribute("data-role", "user");
    expect(messages[1]).toHaveAttribute("data-role", "other");
  });

  it("renders the message input area", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={mockMessages} />);
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByText("Input Area")).toBeInTheDocument();
  });
});
