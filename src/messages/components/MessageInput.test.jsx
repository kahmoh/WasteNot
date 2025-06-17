import { render, screen, fireEvent } from "@testing-library/react";
import MessageInput from "./MessageInput";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("MessageInput", () => {
  it("renders input and send button", () => {
    render(<MessageInput onSend={vi.fn()} />);
    expect(screen.getByPlaceholderText("Send a message...")).toBeInTheDocument();
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<MessageInput onSend={vi.fn()} />);
    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  it("calls onSend and clears input on send button click", () => {
    const mockSend = vi.fn();
    render(<MessageInput onSend={mockSend} />);
    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "Hi" } });
    fireEvent.click(screen.getByTestId("send-button"));
    expect(mockSend).toHaveBeenCalledWith("Hi");
    expect(input.value).toBe("");
  });

  it("calls onSend on Enter key press", () => {
    const mockSend = vi.fn();
    render(<MessageInput onSend={mockSend} />);
    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "Hi" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockSend).toHaveBeenCalledWith("Hi");
  });

  it("does not send if input is empty or whitespace", () => {
    const mockSend = vi.fn();
    render(<MessageInput onSend={mockSend} />);
    const input = screen.getByTestId("message-input");

    // Whitespace case
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByTestId("send-button"));
    expect(mockSend).not.toHaveBeenCalled();

    // Truly empty case
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByTestId("send-button"));
    expect(mockSend).not.toHaveBeenCalled();
  });
});
