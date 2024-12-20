import accountDb from '../repository/account.db';
import { Account } from '../model/account';
import { AccountInput } from '../types/index';
import userDb from '../repository/user.db';
import transactionDb from '../repository/transaction.db';
import { error } from 'console';

const createAccount = async (accountInput: AccountInput): Promise<Account> => {
    // const { isShared, type } = accountInput;
    // const account = new Account({ isShared, type });
    // return accountDb.createAccount(account);

    const account = new Account({ isShared: accountInput.isShared, type: accountInput.type });
    return await accountDb.createAccount(account);
};

const getAccountById = async ({ id }: { id: number }): Promise<Account> => {
    const account = await accountDb.getAccountById({ id });

    if (account === null) {
        throw new Error(`Account with id: ${id} was not found.`);
    }

    return account;
};

const getAccountByAccountNumber = async (accountNumber: string): Promise<Account | null> => {
    const account = await accountDb.getAccountByAccountNumber(accountNumber);

    if (account == null) {
        throw new Error(`Account with ${accountNumber} was not found.`);
    }

    return account;
};

const getAccountsOfUser = async (email: string): Promise<Account[]> => {
    const user = await userDb.getUserByEmail(email);

    if (user == null) {
        throw new Error('No user was found.');
    }

    if (user.getRole() === 'bank') {
        return accountDb.getAllAccounts();
    } else if (user.getRole() === 'admin') {
        return accountDb.getAccountsOfUser(user);
    } else if (user.getRole() === 'user') {
        return accountDb.getTransactionAccountsOfUser(user);
    }
};

const updateAccount = async (email: string, accountInput: AccountInput): Promise<Account> => {
    const user = await userDb.getUserByEmail(email);

    if (user == null) {
        throw new Error('No user was found.');
    }

    let accounts: Account[] = [];

    if (user.getRole() === 'bank') {
        accounts = await accountDb.getAllAccounts();
    } else if (user.getRole() === 'admin') {
        accounts = await accountDb.getAccountsOfUser(user);
    } else if (user.getRole() === 'user') {
        accounts = await accountDb.getTransactionAccountsOfUser(user);
    }

    const account = accounts.filter((account: Account) => account.getId() === accountInput.id)[0];

    account.update({
        status: accountInput.status,
    });

    return await accountDb.updateAccount(account);
};

const deleteAccount = async (accountNumber: string): Promise<void> => {
    const account = await accountDb.getAccountByAccountNumber(accountNumber);

    if (account == null) {
        throw new Error(`Account with account number ${accountNumber} was not found.`);
    }

    for (const user of account.getUsers()) {
        user.removeAccount(account);
    }

    const transactions = await transactionDb.getTransactionsByAccount(account);

    for (const transaction of transactions) {
        await transactionDb.deleteTransaction(transaction);
    }

    return await accountDb.deleteAccount(account);
};

export default {
    createAccount,
    getAccountById,
    getAccountByAccountNumber,
    getAccountsOfUser,
    updateAccount,
    deleteAccount,
};
