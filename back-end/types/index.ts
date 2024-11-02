type UserInput = {
    id?: number;
    nationalRegisterNumber: string;
    name: string;
    birthDate: Date;
    isAdministrator: boolean;
    phoneNumber: string;
    email: string;
    password: string;
};

type AccountInput = {
    id?: number;
    accountNumber?: string;
    balance?: number;
    isShared: boolean;
    startDate?: Date;
    endDate?: Date | null;
    status?: string;
    type: string;
    transactions?: TransactionInput[];
    users: UserInput[];
    budgetgoals?: BudgetgoalInput[];
};

type TransactionInput = {
    id?: number;
    referenceNumber?: string;
    date?: Date;
    amount: number;
    currency: string;
    type: string;
    account: AccountInput;
};

type BudgetgoalInput = {
    id?: number;
    name: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    account: AccountInput;
};

export { UserInput, AccountInput, TransactionInput, BudgetgoalInput };
