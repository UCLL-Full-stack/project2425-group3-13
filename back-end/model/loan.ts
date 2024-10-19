import { Account } from "./account";

export class Loan {
    private id?: number;
    private loanID: string;
    private type: string;
    private amount: number;
    private startDate: Date;
    private endDate: Date;
    private accounts: Account[];

    constructor(loan: {id?: number; type: string; amount: number; startDate: Date; endDate: Date; accounts: Account[]}) {
        this.validate(loan);
        this.id = loan.id
        this.loanID = this.generateLoanId(loan.type, loan.startDate, loan.accounts);
        this.type = loan.type;
        this.amount = loan.amount;
        this.startDate = loan.startDate;
        this.endDate = loan.endDate;
        this.accounts = loan.accounts;
    }

    getId(): number | undefined {
        return this.id;
    }

    getLoanID(): string {
        return this.loanID;
    }

    generateLoanId(type: string, startDate: Date, accounts: Account[]): string {
        const lastThreeNumAccount = accounts.slice(-3).join("");
        const firstTwoLettType = type.slice(0,2);
        const year = startDate.getUTCFullYear().toString();
        const UniqueNumber = Date.now().toString().slice(-3) + Math.random().toString().substring(2, 5);
       
        const loanID = `${firstTwoLettType}-${year}-${lastThreeNumAccount}${UniqueNumber}`
        return loanID
    }

    getType(): string {
        return this.type;
    }

    getAmount(): number {
        return this.amount;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getAccounts(): Account[] {
        return this.accounts;
    }

    validate(loan: {id?: number; type: string; amount: number; startDate: Date; endDate: Date; accounts: Account[]}) {
        if (!loan.amount) {
            throw new Error("Amount is required.");
        } else if (loan.amount <= 0) {
            throw new Error("Amount has to be above 0.")
        }

        if (loan.startDate > loan.endDate) {
            throw new Error("Start date has to be before end date.")
        } else if (loan.startDate.getTime() < Date.now()) {
            throw new Error("Start date cannot be in the past.");
        }

        if (!["Joint", "Individual"].includes(loan.type)) {
            throw new Error("A loan can either be a joint or individual loan.");
        }

        if (!loan.accounts || loan.accounts.length === 0) {
            throw new Error("At least one account is required.");
        }
    }
}
