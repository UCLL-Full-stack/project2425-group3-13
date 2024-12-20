import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountOverview from '@/components/accounts/AccountOverview';
import { Account } from '@/types';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const mockAccounts: Account[] = [
  {
    id: 1,
    accountNumber: '20241104-SAV-370',
    balance: 1000,
    isShared: false,
    startDate: new Date('2023-01-01'),
    endDate: null,
    status: 'Active',
    type: 'savings',
    transactions: [],
    users: [],
    budgetgoals: [],
  },
  {
    id: 2,
    accountNumber: '20241104-TRA-371',
    balance: 500,
    isShared: true,
    startDate: new Date('2023-02-01'),
    endDate: null,
    status: 'Active',
    type: 'transaction',
    transactions: [],
    users: [],
    budgetgoals: [],
  },
];

test('given accounts - when you want to see the overview of the accounts - then the accounts are displayed', async () => {
  // When
  render(<AccountOverview accounts={mockAccounts} />);

  // Then
  expect(screen.getByText('20241104-SAV-370'));
  expect(screen.getByText('1000'));
  expect(screen.getByText('Savings'));
  expect(screen.getByText('Active'));
  expect(screen.getByText(new Date('2023-01-01').toLocaleDateString()));

  expect(screen.getByText('20241104-TRA-371'));
  expect(screen.getByText('500'));
  expect(screen.getByText('Transaction'));
  expect(screen.getByText('Active'));
  expect(screen.getByText(new Date('2023-02-01').toLocaleDateString()));
});

test('given no accounts - when you want to see the overview of the accounts - then a no accounts message is displayed', async () => {
  // When
  render(<AccountOverview accounts={[]} />);

  // Then
  expect(screen.getByText('You currently do not have any accounts.'));
});

test('given shared accounts - when you want to see the overview of the accounts - then the shared accounts are displayed', async () => {
  // When
  render(<AccountOverview accounts={mockAccounts} />);

  // Then
  expect(screen.getByText('20241104-TRA-371'));
  expect(screen.getByText('500'));
  expect(screen.getByText('Transaction'));
  expect(screen.getByText('Active'));
  expect(screen.getByText(new Date('2023-02-01').toLocaleDateString()));
});

test('given accounts - when clicking on an account row - then navigates to the correct URL', async () => {
  // When
  render(<AccountOverview accounts={mockAccounts} />);

  // Act
  fireEvent.click(screen.getByText('20241104-SAV-370'));

  // Then
  expect(mockPush).toHaveBeenCalledWith('/transactions/overview/account/1');
});