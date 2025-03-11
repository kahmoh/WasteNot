import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageInput from "@components/MessageInput";

// Functional test suite
describe("MessageInput Component", () => {
  it("updates the input value when typed into", async () => {
    render(<MessageInput />);
    const input = screen.getByPlaceholderText("Send a message...");
    await userEvent.type(input, "Hello!");
    expect(input).toHaveValue("Hello!");
  });

  it("triggers onSend with the message and clears the input", async () => {
    const mockOnSend = jest.fn();
    render(<MessageInput onSend={mockOnSend} />);
    const input = screen.getByPlaceholderText("Send a message...");
    await userEvent.type(input, "Hello!");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(mockOnSend).toHaveBeenCalledWith("Hello!");
    expect(input).toHaveValue("");
  });

  it("does not send empty messages", async () => {
    const mockOnSend = jest.fn();
    render(<MessageInput onSend={mockOnSend} />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(mockOnSend).not.toHaveBeenCalled();
  });
});

// Test suite for error states
describe("MessageInput Error States", () => {
  it("displays an error when sending an empty message", async () => {
    render(<MessageInput />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByText("Message cannot be empty")).toBeInTheDocument();
  });

  it("shows an error toast when message send fails", async () => {
    const mockOnSend = jest.fn().mockRejectedValueOnce(new Error("API Error"));
    render(<MessageInput onSend={mockOnSend} />);
    await userEvent.type(
      screen.getByPlaceholderText("Send a message..."),
      "Hi"
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    // Check for error toast
    await waitFor(() => {
      expect(screen.getByText("Failed to send message")).toBeInTheDocument();
    });
  });
});
