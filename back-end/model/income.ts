import { Transaction } from './transaction';

export class Income extends Transaction {
    private source: string;

    constructor(income: {
        referenceNumber: string;
        date: Date;
        amount: number;
        currency: string;
        type: string;
        source: string;
        id?: number;
    }) {
        super(income);
        this.validate(income);
        this.source = income.source;
    }

    getsource(): string {
        return this.source;
    }

    validate(income: {
        referenceNumber: string;
        date: Date;
        amount: number;
        currency: string;
        type: string;
        source: string;
        id?: number;
    }) {
        if (!income.source) {
            throw new Error('Source is required.');
        }
    }

    getIncome(source: string) {
        //
    }
}