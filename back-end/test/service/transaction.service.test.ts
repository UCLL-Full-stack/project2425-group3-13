import accountService from '../../service/account.service';
import accountDb from '../../repository/account.db';
import transactionDb from '../../repository/transaction.db';
import userDb from '../../repository/user.db';
import { Account } from '../../model/account';
import { Transaction } from '../../model/transaction';
import transactionService from '../../service/transaction.service';

jest.mock('../../repository/account.db');
jest.mock('../../repository/transaction.db');
jest.mock('../../repository/user.db');

describe('Transaction Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createExpense', () => {
        test('given: valid values for expense, when: creating an expense, then: expense is created with those values', async () => {
            // Given
            const sourceAccount = new Account({
                id: 1,
                accountNumber: '20241104-SAV-370',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            const destinationAccount = new Account({
                id: 2,
                accountNumber: '20241104-SAV-371',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            const expenseTransaction = new Transaction({
                amount: 50,
                currency: 'EUR',
                type: 'expense',
                sourceAccount,
                destinationAccount,
            });
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(sourceAccount);
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(
                destinationAccount
            );
            (transactionDb.createTransaction as jest.Mock).mockResolvedValue(expenseTransaction);

            // When
            const result = await transactionService.createExpense({
                amount: 50,
                currency: 'EUR',
                sourceAccountNumber: '20241104-SAV-370',
                destinationAccountNumber: '20241104-SAV-371',
                type: 'expense',
            });

            // Then
            expect(accountDb.getAccountByAccountNumber).toHaveBeenCalledTimes(2);
            expect(transactionDb.createTransaction).toHaveBeenCalledTimes(2);
            expect(result).toEqual(expenseTransaction);
        });

        test('given: source account does not exist, when: creating an expense, then: error is thrown', async () => {
            // Given
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(null);

            // When & Then
            await expect(
                transactionService.createExpense({
                    amount: 50,
                    currency: 'EUR',
                    sourceAccountNumber: '1234',
                    destinationAccountNumber: '5678',
                    type: 'expense',
                })
            ).rejects.toThrowError('Source account with account number 1234 not found.');
        });

        test('given: destination account does not exist, when: creating an expense, then: error is thrown', async () => {
            // Given
            const sourceAccount = new Account({
                id: 1,
                accountNumber: '20241104-SAV-370',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(sourceAccount);
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(null);

            // When & Then
            await expect(
                transactionService.createExpense({
                    amount: 50,
                    currency: 'EUR',
                    sourceAccountNumber: '1234',
                    destinationAccountNumber: '5678',
                    type: 'expense',
                })
            ).rejects.toThrowError('Destination account with account number 5678 not found.');
        });
    });

    describe('getTransactionsAccountId', () => {
        test('given: valid account ID, when: fetching transactions, then: transactions are returned', async () => {
            // Given
            const sourceAccount = new Account({
                id: 1,
                accountNumber: '20241104-SAV-370',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            const destinationAccount = new Account({
                id: 2,
                accountNumber: '20241104-SAV-371',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            const transactions = [
                new Transaction({
                    amount: 50,
                    currency: 'EUR',
                    type: 'expense',
                    sourceAccount,
                    destinationAccount,
                }),
                new Transaction({
                    amount: 50,
                    currency: 'EUR',
                    type: 'income',
                    sourceAccount,
                    destinationAccount,
                }),
            ];
            (accountDb.getAccountById as jest.Mock).mockResolvedValue(sourceAccount);
            (transactionDb.getTransactionsByAccount as jest.Mock).mockResolvedValue(transactions);

            // When
            const result = await transactionService.getTransactionsAccountId(1);

            // Then
            expect(accountDb.getAccountById).toHaveBeenCalledTimes(1);
            expect(transactionDb.getTransactionsByAccount).toHaveBeenCalledTimes(1);
            expect(result).toEqual(transactions);
        });

        test('given: invalid account ID, when: fetching transactions, then: error is thrown', async () => {
            // Given
            (accountDb.getAccountById as jest.Mock).mockResolvedValue(null);

            // When & Then
            await expect(transactionService.getTransactionsAccountId(1)).rejects.toThrowError(
                'Account with account number 1 not found.'
            );
        });
    });

    describe('getTransactionsByUserId', () => {
        test('given: valid user ID, when: fetching transactions, then: transactions are returned', async () => {
            // Given
            const user = { id: 1, getAccounts: jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }]) };
            const sourceAccount = new Account({
                id: 1,
                accountNumber: '20241104-SAV-370',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            const destinationAccount = new Account({
                id: 2,
                accountNumber: '20241104-SAV-371',
                isShared: false,
                type: 'savings',
                status: 'Active',
                balance: 100,
            });
            const transactions = [
                new Transaction({
                    id: 1,
                    amount: 50,
                    currency: 'EUR',
                    type: 'expense',
                    sourceAccount,
                    destinationAccount,
                }),
                new Transaction({
                    id: 2,
                    amount: 50,
                    currency: 'EUR',
                    type: 'income',
                    sourceAccount,
                    destinationAccount,
                }),
            ];
            (userDb.getUserById as jest.Mock).mockResolvedValue(user);
            (transactionDb.getTransactionsByAccount as jest.Mock).mockResolvedValue(transactions);

            // When
            const result = await transactionService.getTransactionsByUserId(1);

            // Then
            expect(userDb.getUserById).toHaveBeenCalledTimes(1);
            expect(transactionDb.getTransactionsByAccount).toHaveBeenCalledTimes(2);
            expect(result).toEqual(transactions);
        });

        test('given: invalid user ID, when: fetching transactions, then: error is thrown', async () => {
            // Given
            (userDb.getUserById as jest.Mock).mockResolvedValue(null);

            // When & Then
            await expect(transactionService.getTransactionsByUserId(1)).rejects.toThrowError(
                'User with id 1 not found.'
            );
        });
    });
});
