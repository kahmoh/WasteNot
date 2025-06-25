import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatList from "./ChatList/ChatList";
import React from "react";

// Mock ChatItem to simplify testing
// We mock it to isolate testing to ChatList logic without relying on ChatItem’s internal DOM structure.
vi.mock("./ChatItem", () => ({
  default: ({ name, msgPreview, timestamp, onClick, isSelected }) => (
    <div role="button" onClick={onClick} data-selected={isSelected}>
      <span>{name}</span>
      <span>{msgPreview}</span>
      <span>{timestamp}</span>
    </div>
  ),
}));

const chats = [
  {
    id: 1,
    name: "Alice",
    profilePic: "/alice.png",
    messages: [{ text: "Hey there", timestamp: "1:00 PM", role: "user" }],
  },
  {
    id: 2,
    name: "Bob",
    profilePic: "/bob.png",
    messages: [{ text: "Yo!", timestamp: "2:00 PM", role: "user" }],
  },
];

describe("ChatList", () => {
  it("renders all chats passed in", () => {
    render(<ChatList chats={chats} onChatSelect={() => {}} selectedChat={null} />);

    //Ensures key props (name, message preview, timestamp) are rendered.
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hey there")).toBeInTheDocument();
    expect(screen.getByText("Yo!")).toBeInTheDocument();
  });

  it("filters chats based on search query", async () => {
    const user = userEvent.setup();
    render(<ChatList chats={chats} onChatSelect={() => {}} selectedChat={null} />);

    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "Alice");

    expect(screen.getByText("Alice")).toBeInTheDocument();
    //Used to verify filtered-out content is no longer in the DOM.
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("shows 'No chats found' when search has no matches", async () => {
    // We use userEvent because it simulates more realistic user behavior (including keypress timing).
    const user = userEvent.setup();
    render(<ChatList chats={chats} onChatSelect={() => {}} selectedChat={null} />);

    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "Zelda");

    expect(screen.getByText("No chats found")).toBeInTheDocument();
  });

  it("calls onChatSelect when a chat is clicked", async () => {
    const user = userEvent.setup();
    const onChatSelect = vi.fn();
    render(<ChatList chats={chats} onChatSelect={onChatSelect} selectedChat={null} />);

    const aliceChat = screen.getByText("Alice");
    await user.click(aliceChat);

    expect(onChatSelect).toHaveBeenCalledWith(1);
  });

  it("marks selected chat as selected", () => {
    render(<ChatList chats={chats} onChatSelect={() => {}} selectedChat={chats[0]} />);

    const selectedChat = screen.getAllByRole("button").find(el => el.dataset.selected === "true");
    expect(selectedChat).toHaveTextContent("Alice");
  });
});
