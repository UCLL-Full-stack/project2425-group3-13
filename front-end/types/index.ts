type User = {
  id?: number;
  nationalRegisterNumber: string;
  name: string;
  birthDate?: Date;
  isAdministrator: boolean;
  phoneNumber: string;
  email: string;
  password: string;
  accounts?: Account[];
};

type Account = {
  id?: number;
  accountNumber?: string;
  balance?: number;
  isShared: boolean;
  startDate?: Date;
  endDate?: Date | null;
  status?: string;
  type: string;
  transactions?: Transaction[];
  users: User[];
  budgetgoals?: Budgetgoal[];
};

type Transaction = {
  id?: number;
  referenceNumber?: string;
  date?: Date;
  amount: number;
  currency: string;
  type: string;
  destinationAccount: Account;
  sourceAccount: Account;
};

type Budgetgoal = {
  id?: number;
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  account: Account;
};

type Authentication = {
  email: string;
  password: string;
};

type ExpenseData = {
  amount: number;
  currency: string;
  destinationAccountNumber: string;
};

type TransactionFilter = {
  filterOption: string;
  filterValue: string;
};

export type {
  User,
  Transaction,
  Budgetgoal,
  Account,
  Authentication,
  ExpenseData,
  TransactionFilter,
};
