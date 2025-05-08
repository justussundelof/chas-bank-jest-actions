import Login from "@/pages/login";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

describe("Login page", () => {
  it("renders login form", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/Användarnamn/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Lösenord/i)).toBeInTheDocument();
  });

  it("can submit form", () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Användarnamn/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /logga in/i }));
  });
});
