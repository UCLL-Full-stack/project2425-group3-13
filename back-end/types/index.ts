type TransactionType = 'expense' | 'income';

type Role = 'user' | 'admin' | 'bank';

type UserInput = {
    id?: number;
    nationalRegisterNumber: string;
    name: string;
    birthDate: Date;
    role: Role;
    phoneNumber: string;
    email: string;
    password: string;
    accounts?: AccountInput[];
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
};

type TransactionInput = {
    id?: number;
    referenceNumber?: string;
    date?: Date;
    amount: number;
    currency: string;
    destinationAccountNumber: string;
    sourceAccountNumber: string;
    type: TransactionType;
};

type AuthenticationRequest = {
    email: string;
    password: string;
};

type AuthenticationResponse = {
    token: string;
    id?: number;
    email: string;
    name: string;
    nationalRegisterNumber: string;
};

export {
    TransactionType,
    Role,
    UserInput,
    AccountInput,
    TransactionInput,
    AuthenticationRequest,
    AuthenticationResponse,
};
