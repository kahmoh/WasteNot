import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Messages from "./Messages";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

// Mock fetch for chats and messages
beforeEach(() => {
  globalThis.fetch = vi.fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "chat1",
            participant1: { _id: "user1", displayName: "John", profilePic: "/john.jpg" },
            participant2: { _id: "user2", displayName: "Me", profilePic: "/me.jpg" },
            lastMessage: { text: "Thanks!" },
            unreadCount: 1,
            messages: []
          },
          {
            _id: "chat2",
            participant1: { _id: "user2", displayName: "Me", profilePic: "/me.jpg" },
            participant2: { _id: "user3", displayName: "Sarah", profilePic: "/sarah.jpg" },
            lastMessage: { text: "Hey how are you?" },
            unreadCount: 2,
            messages: []
          },
        ])
      })
    )
    .mockImplementation((url) => {
      if (url.includes("messages/chat1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { text: "Thanks!", sender: "user1" },
            { text: "You're welcome!", sender: "user2" }
          ])
        });
      } else if (url.includes("messages/chat2")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { text: "Hey how are you?", sender: "user3" }
          ])
        });
      } else if (url.includes("read")) {
        return Promise.resolve({ ok: true });
      } else if (url.includes("/send")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            text: "This is a test message",
            sender: "user2",
            chatId: "chat2"
          })
        });
      }
    });
});

describe("Messages Integration", () => {
  it("displays placeholder when no chat is selected", async () => {
    render(<Messages />);
    await waitFor(() => screen.getByText("Select a chat to start messaging"));
    expect(screen.getByText("Select a chat to start messaging")).toBeInTheDocument();
  });

  it("opens the chat window when a chat is selected", async () => {
    render(<Messages />);
    const sarahChatItem = await screen.findByRole("button", { name: /Sarah/i });
    fireEvent.click(sarahChatItem);

    await waitFor(() => {
      const chatWindow = screen.getByTestId("chat-window");
      expect(within(chatWindow).getByText("Sarah")).toBeInTheDocument();
      expect(within(chatWindow).getByAltText("Profile Picture")).toBeInTheDocument();
      expect(within(chatWindow).getByText("Hey how are you?")).toBeInTheDocument();
    });
  });

  it("opens a different chat if another contact is clicked", async () => {
    render(<Messages />);
    const johnChatItem = await screen.findByRole("button", { name: /John/i });
    fireEvent.click(johnChatItem);

    await waitFor(() => {
      const chatWindow = screen.getByTestId("chat-window");
      expect(within(chatWindow).getByText("Thanks!")).toBeInTheDocument();
      expect(within(chatWindow).getByText("You're welcome!")).toBeInTheDocument();
      expect(within(chatWindow).getByText("John")).toBeInTheDocument();
    });
  });

  it("adds a new message to the chat when sent", async () => {
    render(<Messages />);
    const sarahChatItem = await screen.findByRole("button", { name: /Sarah/i });
    fireEvent.click(sarahChatItem);

    await waitFor(() => screen.getByTestId("message-input"));

    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "This is a test message" } });

    const sendButton = screen.getByTestId("send-button");
    fireEvent.click(sendButton);

    await waitFor(() => {
      const chatWindow = screen.getByTestId("chat-window");
      expect(within(chatWindow).getByText("This is a test message")).toBeInTheDocument();
    });
  });
});
