// ChatItem.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import ChatItem from "./ChatItem/ChatItem";
import React from "react";

describe("ChatItem", () => {
  const mockProps = {
    profilePic: "/placeholder_profile_img.png",
    name: "Alice",
    msgPreview: "See you soon!",
    timestamp: "2:30 PM",
    onClick: vi.fn(),
    isSelected: false,
  };

  // Rendering Test
  it("renders profile picture, name, message preview, and timestamp", () => {
    render(<ChatItem {...mockProps} />);

    // This confirms static UI structure
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("See you soon!")).toBeInTheDocument();
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();

    // Also useful: check the image src or alt
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/placeholder_profile_img.png");
    expect(img).toHaveAttribute("alt", "Profile Picture");
  });

  // Interaction Test
  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<ChatItem {...mockProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  // Conditional Style Test
  it("applies 'selected' class when isSelected is true", () => {
    render(<ChatItem {...mockProps} isSelected={true} />);

    const container = screen.getByRole("button");
    expect(container.className).toContain("selected");
  });
});
