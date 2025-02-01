import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@components/Header";

describe("Header Component", () => {
    // Test case for rendering the header components
    it("renders the logo, navigation and profile buttons", () => {
        render(<Header />);
        expect(screen.getByText("WasteNot")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Map"})).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Messages" })).toBeInTheDocument();
        expect(screen.getByTestId("profile-icon")).toBeInTheDocument();
    });

    // Test case for user interaction - switching page when clicked
    it("triggers navigation when buttons are clicked", async () => {
        const mockOnNavigate = jest.fn();
        render(<Header onNavigate={mockOnNavigate} />);
        await userEvent.click(screen.getByRole("button", { name: "Map"}));
        expect(mockOnNavigate).toHaveBeenCalledWith("map");
    });
});