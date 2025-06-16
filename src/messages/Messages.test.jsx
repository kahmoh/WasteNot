import { render, screen, fireEvent, within } from "@testing-library/react";
import Messages from "./Messages";
import { describe, it, expect } from "vitest";
import React from "react";

describe("Messages Integration", () => {
  it("displays placeholder when no chat is selected", () => {
    render(<Messages />);
    expect(
      screen.getByText("Select a chat to start messaging")
    ).toBeInTheDocument();
  });

  it("opens the chat window when a chat is selected", () => {
    render(<Messages />);

    // Find and click on "Sarah"
    const sarahChatItem = screen.getByRole("button", { name: /Sarah/i });
    fireEvent.click(sarahChatItem);

    // The placeholder should be gone
    expect(
      screen.queryByText("Select a chat to start messaging")
    ).not.toBeInTheDocument();

    const chatWindow = screen.getByTestId("chat-window");

    // ChatWindow should now render Sarah's chat
    expect(within(chatWindow).getByText("Sarah")).toBeInTheDocument();
    expect(
      within(chatWindow).getByAltText("Profile Picture")
    ).toBeInTheDocument();
    expect(
      within(chatWindow).getByText("Hey how are you?")
    ).toBeInTheDocument();
  });

  it("opens a different chat if another contact is clicked", () => {
    render(<Messages />);

    // Click on "John"
    const johnChatItem = screen.getByRole("button", { name: /John/i }); // selects the one in the chat list
    fireEvent.click(johnChatItem);

    // Now get the chat window content
    const chatWindow = screen.getByTestId("chat-window");

    // Scoped assertions
    expect(within(chatWindow).getByText("Thanks!")).toBeInTheDocument();
    expect(within(chatWindow).getByText("You're welcome!")).toBeInTheDocument();
    expect(within(chatWindow).getByText("John")).toBeInTheDocument();
  });

  it("filters chats based on the search input", () => {
    render(<Messages />);

    // Search for "john"
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "john" } });

    // "John" should appear, "Sarah" should not
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByText("Sarah")).not.toBeInTheDocument();

    // Search for a name that doesn't exist
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    expect(screen.getByText("No chats found")).toBeInTheDocument();
  });
});
