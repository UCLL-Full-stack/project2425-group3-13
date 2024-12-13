import { Account } from '../model/account';
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

        return Account.from({ ...accountPrisma });
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
    // return accounts.find((account) => account.getAccountNumber() === accountNumber);

    try {
        const accountPrisma = await database.account.findUnique({
            where: {
                accountNumber: accountNumber,
            },
        });

        return accountPrisma ? Account.from({ ...accountPrisma }) : null;
    } catch (error: any) {
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

        return Account.from({ ...accountPrisma });
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

export default { createAccount, getAccountById, getAccountByAccountNumber, updateAccount };
