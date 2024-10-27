import { Bank } from './bank';
import { User } from './user';
import { Budgetgoal } from './budgetgoal';
import { Loan } from './loan';
import { Transaction } from './transaction';
import { Income } from './income';
import { Expense } from './expense';

export class Account {
    private id?: number;
    private accountNumber: string;
    private balance: number;
    private isShared: boolean;
    private startDate: Date;
    private endDate: Date;
    private isActive: boolean;
    private type: string;
    private transactions: Transaction[];
    private users: User[];
    private loans: Loan[];
    // private bank: Bank;
    private budgetgoals: Budgetgoal[];

    constructor(account: {
        accountNumber: string;
        balance: number;
        isShared: boolean;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        type: string;
        transactions: Transaction[];
        users: User[];
        loans: Loan[];
        // bank: Bank;
        budgetgoals: Budgetgoal[];
        id?: number;
    }) {
        this.validate(account);
        this.id = account.id;
        this.accountNumber = account.accountNumber;
        this.balance = account.balance;
        this.isShared = account.isShared;
        this.startDate = account.startDate;
        this.endDate = account.endDate;
        this.isActive = account.isActive;
        this.type = account.type;
        this.transactions = account.transactions || [];
        this.users = account.users || [];
        this.loans = account.loans || [];
        // this.bank = account.bank;
        this.budgetgoals = account.budgetgoals || [];
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

    getEndDate(): Date {
        return this.endDate;
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getType(): string {
        return this.type;
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getUsers(): User[] {
        return this.users;
    }

    getLoans(): Loan[] {
        return this.loans;
    }

    // getBank(): Bank {
    //     return this.bank;
    // }

    getBudgetgoals(): Budgetgoal[] {
        return this.budgetgoals;
    }

    validate(account: {
        accountNumber: string;
        balance: number;
        isShared: boolean;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        type: string;
        id?: number;
    }) {
        if (!account.accountNumber) {
            throw new Error('Account number is required.');
        }
        if (!account.balance) {
            throw new Error('Balance is required.');
        }
        if (!account.startDate) {
            throw new Error('Start date is required.');
        }
        if (!account.type) {
            throw new Error('Type is required.');
        }
    }
}
