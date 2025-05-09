import Signup from "@/pages/signup";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

describe("Signup Page", () => {
  it("renders signup form", () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText(/Användarnamn/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Lösenord/i)).toBeInTheDocument();
  });

  it("can submit form", () => {
    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText(/Användarnamn/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /registrera/i }));
  });
});
