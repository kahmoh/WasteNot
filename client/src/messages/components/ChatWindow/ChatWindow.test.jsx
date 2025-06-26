import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatWindow from "./ChatWindow";
import React from "react";

// Mock ChatMessage correctly (based on your real props)
vi.mock("../ChatMessage/ChatMessage", () => ({
  default: ({ message, isCurrentUser }) => (
    <div data-testid="chat-message" data-user={isCurrentUser ? "self" : "other"}>
      {message}
    </div>
  ),
}));

const initialMessages = [
  { text: "Hello!", sender: "user123" },
  { text: "Hi, how can I help?", sender: "bot456" },
];

const currentUser = { _id: "user123" };

describe("ChatWindow", () => {
  it("renders profile picture and name", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={[]} currentUser={currentUser} />);
    expect(screen.getByAltText("Profile Picture")).toHaveAttribute("src", "/profile.jpg");
    expect(screen.getByText("Marcus")).toBeInTheDocument();
  });

  it("renders all chat messages", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={initialMessages} currentUser={currentUser} />);
    const messages = screen.getAllByTestId("chat-message");
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent("Hello!");
    expect(messages[0]).toHaveAttribute("data-user", "self");
    expect(messages[1]).toHaveTextContent("Hi, how can I help?");
    expect(messages[1]).toHaveAttribute("data-user", "other");
  });

  it("renders the message input area", () => {
    render(<ChatWindow profilePic="/profile.jpg" name="Marcus" messages={[]} currentUser={currentUser} />);
    expect(screen.getByPlaceholderText("Send a message...")).toBeInTheDocument();
  });

  it("calls onSend when a new message is submitted", () => {
    const mockSend = vi.fn();

    render(
      <ChatWindow
        profilePic="/profile.jpg"
        name="Marcus"
        messages={initialMessages}
        currentUser={currentUser}
        onSend={mockSend}
      />
    );

    const input = screen.getByPlaceholderText("Send a message...");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.change(input, { target: { value: "This is a new message" } });
    fireEvent.click(sendButton);

    // Verify the onSend callback was triggered with the correct text
    expect(mockSend).toHaveBeenCalledWith("This is a new message");
  });
});
