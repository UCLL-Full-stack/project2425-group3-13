import { Account } from '../model/account';
import { User } from '../model/user';
import database from '../util/database';

// const accounts: Account[] = [];

const createAccount = async (account: Account): Promise<Account> => {
    // const account = new Account({ isShared, type });
    // accounts.push(account);
    // return account;
    try {
        const accountPrisma = await database.account.create({
            data: {
                balance: account.getBalance(),
                accountNumber: account.getAccountNumber(),
                isShared: account.getIsShared(),
                startDate: account.getStartDate(),
                endDate: account.getEndDate(),
                status: account.getStatus(),
                type: account.getType(),
            },
        });

        return Account.from(accountPrisma);
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAccountById = async ({ id }: { id: number }): Promise<Account | null> => {
    // const account = accounts.find((a) => a.getId() === id);
    // return account ? account : null;

    try {
        const accountPrisma = await database.account.findUnique({
            where: {
                id: id,
            },
        });

        return accountPrisma ? Account.from({ ...accountPrisma }) : null;
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAccountByAccountNumber = async (accountNumber: string): Promise<Account | null> => {
    try {
        console.log(`Fetching account with account number: ${accountNumber}`);
        const accountPrisma = await database.account.findUnique({
            where: {
                accountNumber: accountNumber,
            },
        });
        console.log(`Fetched account: ${JSON.stringify(accountPrisma)}`);
        if (accountPrisma) {
            return Account.from(accountPrisma);
        } else {
            return null;
        }
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateAccount = async (account: Account): Promise<Account> => {
    try {
        const accountPrisma = await database.account.update({
            where: {
                id: account.getId(),
            },
            data: {
                balance: account.getBalance(),
                isShared: account.getIsShared(),
                startDate: account.getStartDate(),
                endDate: account.getEndDate(),
                status: account.getStatus(),
                type: account.getType(),
            },
        });

        return Account.from(accountPrisma);
    } catch (error: any) {
        // throw new Error('Database error. See server log for details.');

        throw new Error(`Database error: ${error.message}`);
    }
};

const deleteAccount = async (account: Account): Promise<void> => {
    try {
        await database.account.delete({
            where: {
                id: account.getId(),
            },
        });
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAllAccounts = async (): Promise<Account[]> => {
    try {
        const accounts = await database.account.findMany();
        return accounts.map((account) => Account.from(account));
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getAccountsOfUser = async (user: User): Promise<Account[]> => {
    try {
        const accounts = await database.account.findMany({
            where: {
                users: {
                    some: {
                        id: user.getId(),
                    },
                },
            },
        });

        return accounts.map((account) => Account.from(account));
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getTransactionAccountsOfUser = async (user: User): Promise<Account[]> => {
    try {
        const accounts = await database.account.findMany({
            where: {
                users: {
                    some: {
                        id: user.getId(),
                    },
                },
                type: 'transaction',
            },
        });

        return accounts.map((account) => Account.from(account));
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createAccount,
    getAccountById,
    getAccountByAccountNumber,
    updateAccount,
    deleteAccount,
    getAllAccounts,
    getAccountsOfUser,
    getTransactionAccountsOfUser,
};
