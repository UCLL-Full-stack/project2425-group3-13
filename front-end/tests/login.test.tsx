import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/users/LoginForm';
import UserService from '../services/UserService';
import { useRouter } from 'next/router';

jest.mock('../services/UserService');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i));
    expect(screen.getByLabelText(/password/i));
    expect(screen.getByRole('button', { name: /login/i }));
  });

  test('submits login form successfully', async () => {
    const mockUser = {
      token: 'fake-token',
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      nationalRegisterNumber: '123456789',
    };
    (UserService.loginUser as jest.Mock).mockResolvedValue(mockUser);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/login successful!/i));
    expect(mockPush).toHaveBeenCalledWith(`/accounts/${mockUser.nationalRegisterNumber}`);
  });

  test('shows error message on login failure', async () => {
    (UserService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid email or password/i));
  });
});