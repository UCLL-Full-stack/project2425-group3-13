import { User } from './user';
import { Budgetgoal } from './budgetgoal';
import { Loan } from './loan';
import { Transaction } from './transaction';

export class Account {
    public id?: number;
    public accountNumber: string;
    public balance: number;
    public isShared: boolean;
    public startDate: Date;
    public endDate: Date | null;
    public status: string;
    public type: string;
    public transactions: Transaction[];
    public users: User[];
    // public loans: Loan[];
    public budgetgoals: Budgetgoal[];

    constructor(account: { id?: number; isShared: boolean; type: string; users: User[] }) {
        this.validate(account);

        this.id = account.id;
        this.type = account.type;
        this.accountNumber = this.generateAccountNumber();
        this.balance = 0;
        this.isShared = account.isShared;
        this.startDate = new Date();
        this.endDate = null;
        this.status = 'Active';
        this.transactions = [];
        this.users = account.users;
        // this.loans = [];
        this.budgetgoals = [];
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

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getUsers(): User[] {
        return this.users;
    }

    // getLoans(): Loan[] {
    //     return this.loans;
    // }

    getBudgetgoals(): Budgetgoal[] {
        return this.budgetgoals;
    }

    validate(account: { isShared: boolean; type: string; id?: number }) {
        if (account.isShared === undefined) {
            throw new Error('Is shared is required.');
        }
        if (!account.type) {
            throw new Error('Type is required.');
        }
    }

    generateAccountNumber(): string {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const type = this.type.substring(0, 3).toUpperCase();
        const randomNumbers = Math.floor(100 + Math.random() * 900);

        return `${today}-${type}-${randomNumbers}`;
    }
}
