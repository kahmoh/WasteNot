import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatList from "@components/ChatList";

const mockChats = [
  { name: "Sarah", message: "Hey friend", time: "1:47 PM" },
  { name: "John", message: "See you tomorrow!", time: "2:00 PM" },
];

// Functional test suite
describe("ChatList Component", () => {
  it("renders the search bar and chat list", () => {
    render(<ChatList chats={mockChats} />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Sarah")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("filters chats based on search inputs", () => {
    render(<ChatList chats={mockChats} />);
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "Sarah" },
    });
    expect(screen.getByText("Sarah")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
  });

  it("displays 'No chats found' when search has no results", () => {
    render(<ChatList chats={[]} />);
    expect(screen.getByText("No chats found")).toBeInTheDocument();
  });
});

// Test suite for error states
describe("ChatList Error States", () => {
  it("displays an error message when API fails", async () => {
    // Mock a failed API call
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("API Error"));
    render(<ChatList />);
    // Wait for the error state
    await waitFor(() => {
      expect(screen.getByText("Failed to load chats")).toBeInTheDocument();
    });
  });

  it("shows a loading spinner while fetching data", () => {
    render(<ChatList isLoading={true} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
