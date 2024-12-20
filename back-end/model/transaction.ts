import { Account } from './account';
import { Account as AccountPrisma, Transaction as TransactionPrisma } from '@prisma/client';
import { TransactionType } from '../types';

export class Transaction {
    private id?: number;
    private amount: number;
    private currency: string;
    private sourceAccount: Account;
    private destinationAccount: Account;
    private date: Date;
    private referenceNumber: string;
    private type: TransactionType;

    constructor(transaction: {
        referenceNumber?: string;
        date?: Date;
        amount: number;
        currency: string;
        sourceAccount: Account;
        destinationAccount: Account;
        type: TransactionType;
        id?: number;
    }) {
        this.validate(transaction);
        this.id = transaction.id;
        this.amount = transaction.amount;
        this.currency = transaction.currency;
        this.sourceAccount = transaction.sourceAccount;
        this.destinationAccount = transaction.destinationAccount;
        this.date = transaction.date || new Date();
        this.referenceNumber =
            transaction.referenceNumber || this.generateReferenceNumber(transaction.type);
        this.type = transaction.type;
    }

    getId(): number | undefined {
        return this.id;
    }

    getReferenceNumber(): string {
        return this.referenceNumber;
    }

    getDate(): Date {
        return this.date;
    }

    getAmount(): number {
        return this.amount;
    }

    getCurrency(): string {
        return this.currency;
    }

    getSourceAccount(): Account {
        return this.sourceAccount;
    }

    getDestinationAccount(): Account {
        return this.destinationAccount;
    }

    getSourceAccountId(): number | undefined {
        return this.sourceAccount.getId();
    }

    getDestinationAccountId(): number | undefined {
        return this.destinationAccount.getId();
    }

    getTransactionType(): TransactionType {
        return this.type;
    }

    validate(transaction: {
        amount: number;
        currency: string;
        sourceAccount: Account;
        destinationAccount: Account;
        id?: number;
    }) {
        if (transaction.amount === undefined) {
            throw new Error('Amount is required.');
        } else if (transaction.currency === undefined) {
            throw new Error('Currency is required.');
        } else if (transaction.sourceAccount === undefined) {
            throw new Error('Source account is required.');
        } else if (transaction.destinationAccount === undefined) {
            throw new Error('Destination account is required.');
        } else if (transaction.amount <= 0) {
            throw new Error('Amount must be greater than 0.');
        } else if (
            transaction.currency !== 'USD' &&
            transaction.currency !== 'EUR' &&
            transaction.currency !== 'GBP'
        ) {
            throw new Error('Currency must be either USD, EUR or GBP.');
        } else if (transaction.destinationAccount === transaction.sourceAccount) {
            throw new Error('Source and destination accounts must be different.');
        } else if (transaction.sourceAccount.getBalance() - transaction.amount < 0) {
            throw new Error('Insufficient funds.');
        }
    }

    generateReferenceNumber(type: string): string {
        const lastThreeNumbers = this.sourceAccount.getAccountNumber().slice(-3);
        const firstThreeLettType = type.slice(0, 3).toUpperCase();
        const year = this.date.getUTCFullYear().toString();
        const uniqueNumber =
            Date.now().toString().slice(-3) + Math.random().toString().substring(2, 5);
        const referenceNumber = `${firstThreeLettType}-${lastThreeNumbers}-${year}-${uniqueNumber}`;
        return referenceNumber;
    }

    static from(
        transactionPrisma: TransactionPrisma & {
            sourceAccount: AccountPrisma;
            destinationAccount: AccountPrisma;
        }
    ): Transaction {
        return new Transaction({
            id: transactionPrisma.id,
            amount: transactionPrisma.amount,
            currency: transactionPrisma.currency,
            sourceAccount: Account.from(transactionPrisma.sourceAccount),
            destinationAccount: Account.from(transactionPrisma.destinationAccount),
            type: transactionPrisma.type,
            referenceNumber: transactionPrisma.referenceNumber,
            date: transactionPrisma.date,
        });
    }
}
