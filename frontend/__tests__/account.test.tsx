import Account from '@/pages/account';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  // Mock router
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
  });

  // Mock localStorage
  Storage.prototype.getItem = jest.fn(() => 'test-token');
  Storage.prototype.removeItem = jest.fn();

  // Mock fetch for GET account
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ amount: 1000 }),
      ok: true,
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders account page with balance', async () => {
  render(<Account />);
  expect(screen.getByText(/Laddar konto/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Saldo/i)).toBeInTheDocument();
    expect(screen.getByText(/1000 kr/)).toBeInTheDocument();
  });
});

test('can type deposit amount and click deposit', async () => {
  render(<Account />);

  await screen.findByText(/Saldo/i);

  const input = screen.getByPlaceholderText(/sätt in belopp/i);
  fireEvent.change(input, { target: { value: '123' } });

  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: () => Promise.resolve({ amount: 1123 }),
    ok: true,
  });

  const button = screen.getByText(/Sätt in/i);
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText(/Insättning lyckades/i)).toBeInTheDocument();
  });
});

test('clicking logout removes token and redirects', async () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  render(<Account />);

  await screen.findByText(/Saldo/i);

  const logoutBtn = screen.getByTestId('logout');
  fireEvent.click(logoutBtn);

  expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  expect(mockPush).toHaveBeenCalledWith('/login');
});
