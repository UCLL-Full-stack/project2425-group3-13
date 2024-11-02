import { Transaction } from './transaction';
import { Account } from './account';

export class Expense extends Transaction {
    private destination: string;

    constructor(expense: {
        amount: number;
        currency: string;
        type: string;
        destination: string;
        account: Account;
        id?: number;
    }) {
        super(expense);
        this.destination = expense.destination;
    }

    getDestination(): string {
        return this.destination;
    }

    // makeExpense(destination: string) {
    //
    // }
}
