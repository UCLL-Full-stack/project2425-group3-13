type UserInput = {
    id?: number;    
    nationalRegisterNumber: string;
    name: string;
    isAdministrator: boolean;
    phoneNumber: string;
    email: string;
    password: string;
    accounts: AccountInput[];  
}

type AccountInput = {
    id?: number;
    accountNumber: string;
    balance: number;
    isShared: boolean;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    type: string;
    transactions: TransactionInput[];
    users: UserInput[];
    loans: LoanInput[];
    // bank: Bank;
    budgetgoals: BudgetgoalInput[];
}

type LoanInput = {
    id?: number; 
    type: string; 
    amount: number; 
    startDate: Date; 
    endDate: Date; 
    accounts: AccountInput[]
}

type TransactionInput = {
    id?: number;
    referenceNumber: string;
    date: Date;
    amount: number;
    currency: string;
    type: string;
}

type BudgetgoalInput = {
    id?: number;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    isActive: boolean;
    accounts: AccountInput[];
}