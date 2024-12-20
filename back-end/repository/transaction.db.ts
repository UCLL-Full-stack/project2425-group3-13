import { PrismaClient } from '@prisma/client';
import { Account } from '../model/account';
import { Transaction } from '../model/transaction';
import { de } from 'date-fns/locale';

const database = new PrismaClient();

const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
    try {
        const transactionPrisma = await database.transaction.create({
            data: {
                referenceNumber: transaction.getReferenceNumber(),
                date: transaction.getDate(),
                amount: transaction.getAmount(),
                currency: transaction.getCurrency(),
                sourceAccountId: transaction.getSourceAccount().getId(),
                destinationAccountId: transaction.getDestinationAccount().getId(),
                type: transaction.getTransactionType(),
            },
            include: {
                sourceAccount: true,
                destinationAccount: true,
            },
        });

        return Transaction.from(transactionPrisma);
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getTransactionsByAccount = async (account: Account): Promise<Transaction[]> => {
    try {
        const transactionsPrisma = await database.transaction.findMany({
            where: {
                OR: [
                    { sourceAccountId: account.getId() },
                    { destinationAccountId: account.getId() },
                ],
            },
            include: {
                sourceAccount: true,
                destinationAccount: true,
            },
        });

        return transactionsPrisma.map((transactionPrisma) => Transaction.from(transactionPrisma));
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const filterTransactionsByAccount = async (
    account: Account,
    filterOption: string,
    filterValue: string
): Promise<Transaction[]> => {
    try {
        const filterCondition: any = {
            AND: [
                {
                    OR: [
                        { sourceAccountId: account.getId() },
                        { destinationAccountId: account.getId() },
                    ],
                },
            ],
        };

        if (filterOption === 'amount') {
            filterCondition.AND.push({
                [filterOption]: Number(filterValue),
            });
        } else if (filterOption === 'sourceAccount' || filterOption === 'destinationAccount') {
            filterCondition.AND.push({
                [filterOption]: {
                    accountNumber: { contains: filterValue },
                },
            });
        } else if (filterOption === 'date') {
            filterCondition.AND.push({
                [filterOption]: {
                    gte: new Date(filterValue),
                    lt: new Date(
                        new Date(filterValue).setDate(new Date(filterValue).getDate() + 1)
                    ),
                },
            });
        } else if (filterOption === 'type' || filterOption === 'currency') {
            filterCondition.AND.push({
                [filterOption]: filterValue,
            });
        } else {
            filterCondition.AND.push({
                [filterOption]: { contains: filterValue },
            });
        }

        const transactionsPrisma = await database.transaction.findMany({
            where: filterCondition,
            include: {
                sourceAccount: true,
                destinationAccount: true,
            },
        });

        return transactionsPrisma.map((transactionPrisma) => Transaction.from(transactionPrisma));
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteTransaction = async (transaction: Transaction): Promise<Transaction> => {
    try {
        const deletedTransaction = await database.transaction.delete({
            where: {
                id: transaction.getId(),
            },
            include: {
                sourceAccount: true,
                destinationAccount: true,
            },
        });

        return Transaction.from(deletedTransaction);
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createTransaction,
    getTransactionsByAccount,
    filterTransactionsByAccount,
    deleteTransaction,
};
