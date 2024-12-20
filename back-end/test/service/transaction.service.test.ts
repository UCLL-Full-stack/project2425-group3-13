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

describe('Account Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createExpense', () => {
        it('should create an expense successfully (happy path)', async () => {
            // Arrange
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
                sourceAccount: sourceAccount,
                destinationAccount: destinationAccount,
            });

            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(sourceAccount);
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(
                destinationAccount
            );
            (transactionDb.createTransaction as jest.Mock).mockResolvedValue(expenseTransaction);

            // Act
            const result = await transactionService.createExpense({
                amount: 50,
                currency: 'EUR',
                sourceAccountNumber: '1234',
                destinationAccountNumber: '5678',
                type: 'expense',
            });

            // Assert
            expect(accountDb.getAccountByAccountNumber).toHaveBeenCalledTimes(2);
            expect(transactionDb.createTransaction).toHaveBeenCalledTimes(2);
            expect(result).toEqual(expenseTransaction);
        });

        it('should throw an error if source account is not found (unhappy path)', async () => {
            // Arrange
            (accountDb.getAccountByAccountNumber as jest.Mock).mockResolvedValueOnce(null);

            // Act & Assert
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

        it('should throw an error if destination account is not found (unhappy path)', async () => {
            // Arrange
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

            // Act & Assert
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
        it('should return transactions by account ID (happy path)', async () => {
            // Arrange
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
                    sourceAccount: sourceAccount,
                    destinationAccount: destinationAccount,
                }),
                new Transaction({
                    amount: 50,
                    currency: 'EUR',
                    type: 'income',
                    sourceAccount: sourceAccount,
                    destinationAccount: destinationAccount,
                }),
            ];

            (accountDb.getAccountById as jest.Mock).mockResolvedValue(sourceAccount);
            (transactionDb.getTransactionsByAccount as jest.Mock).mockResolvedValue(transactions);

            // Act
            const result = await transactionService.getTransactionsAccountId(1);

            // Assert
            expect(accountDb.getAccountById).toHaveBeenCalledTimes(1);
            expect(transactionDb.getTransactionsByAccount).toHaveBeenCalledTimes(1);
            expect(result).toEqual(transactions);
        });

        it('should throw an error if account is not found (unhappy path)', async () => {
            // Arrange
            (accountDb.getAccountById as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(transactionService.getTransactionsAccountId(1)).rejects.toThrowError(
                'Account with account number 1 not found.'
            );
        });
    });

    describe('getTransactionsByUserId', () => {
        it('should return transactions for a user ID (happy path)', async () => {
            // Arrange
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
                    sourceAccount: sourceAccount,
                    destinationAccount: destinationAccount,
                }),
                new Transaction({
                    id: 2,
                    amount: 50,
                    currency: 'EUR',
                    type: 'income',
                    sourceAccount: sourceAccount,
                    destinationAccount: destinationAccount,
                }),
            ];
            (userDb.getUserById as jest.Mock).mockResolvedValue(user);
            (transactionDb.getTransactionsByAccount as jest.Mock).mockResolvedValue(transactions);

            // Act
            const result = await transactionService.getTransactionsByUserId(1);

            // Assert
            expect(userDb.getUserById).toHaveBeenCalledTimes(1);
            expect(transactionDb.getTransactionsByAccount).toHaveBeenCalledTimes(2);
            expect(result).toEqual(transactions);
        });

        it('should throw an error if user is not found (unhappy path)', async () => {
            // Arrange
            (userDb.getUserById as jest.Mock).mockResolvedValue(null);

            // Act & Assert
            await expect(transactionService.getTransactionsByUserId(1)).rejects.toThrowError(
                'User with id 1 not found.'
            );
        });
    });
});
