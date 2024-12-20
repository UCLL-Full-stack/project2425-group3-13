import accountDb from '../repository/account.db';
import { Account } from '../model/account';
import { AccountInput } from '../types/index';
import userDb from '../repository/user.db';
import transactionDb from '../repository/transaction.db';

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
    console.log(`Service: Fetching account with account number: ${accountNumber}`);
    const account = await accountDb.getAccountByAccountNumber(accountNumber);

    if (account == null) {
        console.error(`Service: Account with account number ${accountNumber} was not found.`);
        return null;
    }

    console.log(`Service: Fetched account: ${JSON.stringify(account)}`);
    return account;
};

const getAccountsOfUser = async (email: string): Promise<Account[]> => {
    const user = await userDb.getUserByEmail(email);

    if (user == null) {
        throw new Error('No user was found.');
    }
    const accountsOfUser = user.getAccounts();

    if (user.getIsAdministrator() === true) {
        return accountsOfUser;
    } else {
        return accountsOfUser.filter((account) => account.getType() === 'transaction');
    }
};

const updateAccount = async (email: string, accountInput: AccountInput): Promise<Account> => {
    const user = await userDb.getUserByEmail(email);

    if (user == null) {
        throw new Error('No user was found.');
    }
    const accountsOfUser = user.getAccounts();

    const account = accountsOfUser.filter((account) => account.getId() === accountInput.id)[0];

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
