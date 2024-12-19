import accountDb from '../repository/account.db';
import transactionDb from '../repository/transaction.db';
import { TransactionInput } from '../types';
import { Transaction } from '../model/transaction';
import userDb from '../repository/user.db';

const createExpense = async (ExpenseInput: TransactionInput): Promise<Transaction> => {
    const { amount, currency, sourceAccountNumber, destinationAccountNumber, type } = ExpenseInput;

    const sourceAccount = await accountDb.getAccountByAccountNumber(sourceAccountNumber);
    const destinationAccount = await accountDb.getAccountByAccountNumber(destinationAccountNumber);

    if (!sourceAccount) {
        throw new Error(`Source account with account number ${sourceAccountNumber} not found.`);
    }

    if (!destinationAccount) {
        throw new Error(
            `Destination account with account number ${destinationAccountNumber} not found.`
        );
    }

    if (sourceAccount.getStatus() === 'Blocked' || sourceAccount.getStatus() === 'Closed') {
        throw new Error(
            `Account is ${sourceAccount.getStatus()}, no transactions can be made or received.`
        );
    }

    sourceAccount.calculateBalance(amount, 'expense');
    destinationAccount.calculateBalance(amount, 'income');

    await accountDb.updateAccount(sourceAccount);
    await accountDb.updateAccount(destinationAccount);

    const expenseTransaction = new Transaction({
        amount,
        currency,
        sourceAccount: sourceAccount,
        destinationAccount: destinationAccount,
        type: 'expense',
    });

    const incomeTransaction = new Transaction({
        amount,
        currency,
        sourceAccount: sourceAccount,
        destinationAccount: destinationAccount,
        type: 'income',
    });

    const createdExpense = await transactionDb.createTransaction(expenseTransaction);
    const createdIncome = await transactionDb.createTransaction(incomeTransaction);

    return createdExpense;
};

const getTransactionsAccountId = async (id: number): Promise<Transaction[]> => {
    const account = await accountDb.getAccountById({ id });

    if (!account) {
        throw new Error(`Account with account number ${id} not found.`);
    }

    const transactions = await transactionDb.getTransactionsByAccount(account);

    return transactions;
};

const getTransactionsByUserId = async (id: number): Promise<Transaction[]> => {
    const user = await userDb.getUserById(id);

    if (!user) {
        throw new Error(`User with id ${id} not found.`);
    }

    const accounts = user.getAccounts();

    const transactions = await Promise.all(
        accounts.map(async (account) => {
            return await transactionDb.getTransactionsByAccount(account);
        })
    );

    const flatTransactions = transactions.flat();

    const uniqueTransactions = flatTransactions.filter(
        (transaction, index, self) =>
            index === self.findIndex((t) => t.getId() === transaction.getId())
    );

    return uniqueTransactions;
};

const filterAccountTransactions = async (
    id: number,
    filterOption: string,
    filterValue: string
): Promise<Transaction[]> => {
    const account = await accountDb.getAccountById({ id });

    if (!account) {
        throw new Error(`Account with account number ${id} not found.`);
    }

    const transactions = await transactionDb.filterTransactionsByAccount(
        account,
        filterOption,
        filterValue
    );

    return transactions;
};

const filterUserTransactions = async (
    id: number,
    filterOption: string,
    filterValue: string
): Promise<Transaction[]> => {
    const user = await userDb.getUserById(id);

    if (!user) {
        throw new Error(`User with id ${id} not found.`);
    }

    const accounts = user.getAccounts();

    const transactions = await Promise.all(
        accounts.map(async (account) => {
            return await transactionDb.filterTransactionsByAccount(
                account,
                filterOption,
                filterValue
            );
        })
    );

    const flatTransactions = transactions.flat();

    const uniqueTransactions = flatTransactions.filter(
        (transaction, index, self) =>
            index === self.findIndex((t) => t.getId() === transaction.getId())
    );

    return uniqueTransactions;
};

export default {
    createExpense,
    getTransactionsAccountId,
    getTransactionsByUserId,
    filterAccountTransactions,
    filterUserTransactions,
};
