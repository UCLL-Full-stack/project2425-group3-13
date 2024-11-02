import { Transaction } from './transaction';
import { Account } from './account';

export class Income extends Transaction {
    private source: string;

    constructor(income: {
        amount: number;
        currency: string;
        type: string;
        source: string;
        account: Account;
        id?: number;
    }) {
        super(income);
        this.source = income.source;
    }

    getSource(): string {
        return this.source;
    }

    getIncome(source: string): Income {
        return this;
    }
}
