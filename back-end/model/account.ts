import { Account as AccountPrisma } from '@prisma/client';
import { User } from './user';
import { Transaction } from './transaction';
import { TransactionType } from '../types';

export class Account {
    private id?: number;
    private accountNumber: string;
    private balance: number;
    private isShared: boolean;
    private startDate: Date;
    private endDate: Date | null;
    private status: string;
    private type: string;
    private transactions: Transaction[];
    private users: User[];

    constructor(account: {
        id?: number;
        accountNumber?: string;
        isShared: boolean;
        type: string;
        // users?: User[];
        balance?: number;
        startDate?: Date;
        endDate?: Date | null;
        status?: string;
        transactions?: Transaction[];
        users?: User[];
    }) {
        this.validate(account);

        this.id = account.id;
        this.type = account.type;
        this.accountNumber = account.accountNumber || this.generateAccountNumber();
        this.balance = account.balance || 0;
        this.isShared = account.isShared;
        this.startDate = account.startDate || new Date();
        this.endDate = account.endDate || null;
        this.status = account.status || 'Active';
        this.transactions = [];
        this.users = [];
    }

    getId(): number | undefined {
        return this.id;
    }

    getAccountNumber(): string {
        return this.accountNumber;
    }

    getBalance(): number {
        return this.balance;
    }

    getIsShared(): boolean {
        return this.isShared;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date | null {
        return this.endDate;
    }

    getStatus(): string {
        return this.status;
    }

    getType(): string {
        return this.type;
    }

    getUsers(): User[] {
        return this.users;
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    generateAccountNumber(): string {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const type = this.type.substring(0, 3).toUpperCase();
        const randomNumbers = Math.floor(100 + Math.random() * 900);

        return `${today}-${type}-${randomNumbers}`;
    }

    addUser(user: User): void {
        if (
            this.users.find(
                (user) => user.getNationalRegisterNumber() === user.getNationalRegisterNumber()
            )
        ) {
            throw new Error(
                `User with national register number ${user.getNationalRegisterNumber()} has already been added to this account.`
            );
        }
        this.users.push(user);
    }

    calculateBalance(amount: number, type: string): number {
        if (type === 'income') {
            return (this.balance += amount);
        } else if (type === 'expense') {
            return (this.balance -= amount);
        } else {
            throw new Error('Transaction type must be either "income" or "expense".');
        }
    }

    validate(account: {
        id?: number;
        accountNumber?: string;
        balance?: number;
        isShared: boolean;
        startDate?: Date;
        endDate?: Date | null;
        status?: string;
        type: string;
    }) {
        if (account.balance < 0) {
            throw new Error('Balance must be greater than or equal to 0.');
        }
        if (!account.accountNumber) {
            throw new Error('Account number is required.');
        }
        if (!account.type) {
            throw new Error('Account type is required.');
        }
    }

    toJSON() {
        return {
            id: this.id,
            accountNumber: this.accountNumber,
            balance: this.balance,
            isShared: this.isShared,
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
            type: this.type,
            transactions: this.transactions,
        };
    }

    static from(accountPrisma: AccountPrisma): Account {
        return new Account({
            id: accountPrisma.id,
            accountNumber: accountPrisma.accountNumber,
            balance: accountPrisma.balance,
            isShared: accountPrisma.isShared,
            startDate: accountPrisma.startDate,
            endDate: accountPrisma.endDate,
            status: accountPrisma.status,
            type: accountPrisma.type,
        });
    }
}
