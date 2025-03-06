import { render, screen } from "@testing-library/react";
import ChatWindow from "@components/ChatWindow";

const mockMessages = [
  { id: 1, sender: "Sarah", text: "Do you want to meet up later?" },
  { id: 2, sender: "You", text: "Sounds good!" },
];

// Functional test suite
describe("ChatWindow Component", () => {
  it("renders messages with sender names and content", () => {
    render(<ChatWindow messages={mockMessages} />);
    expect(
      screen.getByText("Do you want to meet up later?")
    ).toBeInTheDocument();
    expect(screen.getByText("Sounds good!")).toBeInTheDocument();
  });

  it("shows a loading spinner when messages are being fetched", () => {
    render(<ChatWindow isLoading={true} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays 'No messages yet' when empty", () => {
    render(<ChatWindow messages={[]} />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
  });

  it("shows an error when messages fail to load", async () => {
    // Mock a failed API call
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("API Error"));
    render(<ChatWindow />);
    await waitFor(() => {
      expect(screen.getByText("Failed to load messages")).toBeInTheDocument();
    });
  });

  it("displays a retry button if sending a message fails", async () => {
    const mockSendMessage = jest
      .fn()
      .mockRejectedValueOnce(new Error("Send failed"));
    render(<ChatWindow onSendMessage={mockSendMessage} />);
    // Simulate a failed message send
    const input = screen.getByPlaceholderText("Send a message...");
    await userEvent.type(input, "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

// Test suite for error states
describe("ChatWindow Error States", () => {
  it("shows an error when messages fail to load", async () => {
    // Mock a failed API call
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("API Error"));
    render(<ChatWindow />);
    await waitFor(() => {
      expect(screen.getByText("Failed to load messages")).toBeInTheDocument();
    });
  });

  it("displays a retry button if sending a message fails", async () => {
    const mockSendMessage = jest
      .fn()
      .mockRejectedValueOnce(new Error("Send failed"));
    render(<ChatWindow onSendMessage={mockSendMessage} />);
    // Simulate a failed message send
    const input = screen.getByPlaceholderText("Send a message...");
    await userEvent.type(input, "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
