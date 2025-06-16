import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatWindow from "./ChatWindow";
import React from "react";

// Mock ChatMessage only
vi.mock("./ChatMessage", () => ({
  default: ({ message, role }) => (
    <div data-testid="chat-message" data-role={role}>
      {message}
    </div>
  ),
}));

const initialMessages = [
  { text: "Hello!", role: "user" },
  { text: "Hi, how can I help?", role: "other" },
];

describe("ChatWindow", () => {
  it("renders profile picture and name", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={[]} />);
    expect(screen.getByAltText("Profile Picture")).toHaveAttribute("src", "/profile.jpg");
    expect(screen.getByText("Marcus")).toBeInTheDocument();
  });

  it("renders all chat messages", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={initialMessages} />);
    const messages = screen.getAllByTestId("chat-message");
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent("Hello!");
    expect(messages[1]).toHaveTextContent("Hi, how can I help?");
  });

  it("renders the message input area", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={initialMessages} />);
    expect(screen.getByPlaceholderText("Send a message...")).toBeInTheDocument();
  });

  it("adds a new message when sent", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={initialMessages} />);

    const input = screen.getByPlaceholderText("Send a message...");
    const sendButton = screen.getByTestId("send-button");

    // Type a new message
    fireEvent.change(input, { target: { value: "This is a new message" } });
    fireEvent.click(sendButton);

    // Expect the new message to appear
    const messages = screen.getAllByTestId("chat-message");
    expect(messages).toHaveLength(3);
    expect(messages[2]).toHaveTextContent("This is a new message");
    expect(messages[2]).toHaveAttribute("data-role", "user");
  });
});
