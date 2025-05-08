import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "../pages/signup";

describe("Signup Page", () => {
  it("renders signup form", () => {
    render(<Signup />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("can submit form", () => {
    render(<Signup />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  });
});
