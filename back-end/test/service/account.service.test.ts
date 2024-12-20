import { userInfo } from 'os';
import { Account } from '../../model/account';
import accountDb from '../../repository/account.db';
import accountService from '../../service/account.service';
import { AccountInput, UserInput } from '../../types';
import userDb from '../../repository/user.db';
import { User } from '../../model/user';

const mockDate = new Date('2024-11-04T22:54:24.861Z');

const accountInput: AccountInput = {
    id: 1,
    accountNumber: '20241104-SAV-370',
    isShared: false,
    type: 'savings',
    balance: 0,
    startDate: mockDate, 
    endDate: null,
    status: 'Active',
    transactions: [],
};

const accountInput2: AccountInput = {
    id: 1,
    accountNumber: '20241104-SAV-470',
    isShared: true,
    type: 'transaction',
    balance: 0,
    startDate: mockDate, 
    endDate: null,
    status: 'Active',
    transactions: [],
};

const accountInput3: AccountInput = {
    id: 1,
    accountNumber: '20241104-SAV-570',
    isShared: true,
    type: 'transaction',
    balance: 0,
    startDate: mockDate, 
    endDate: null,
    status: 'Active',
    transactions: [],
};

const account = new Account({
    ...accountInput,
    transactions: []
});

const account2 = new Account({
    ...accountInput2,
    transactions: []
});

const account3 = new Account({
    ...accountInput3,
    transactions: []
});

const userInputBank: UserInput = { 
    nationalRegisterNumber: '99.01.01-123.44',
    name: 'John Doe',
    birthDate: new Date('2001-01-01'),
    role: 'bank',
    phoneNumber: '0123456789',
    email: 'john.oe@gmail.com',
    password: 'Password1!',
    accounts: []    
};

const userInputAdmin: UserInput = { 
    nationalRegisterNumber: '99.01.01-123.44',
    name: 'John Doe',
    birthDate: new Date('2001-01-01'),
    role: 'admin',
    phoneNumber: '0123456789',
    email: 'john.d@gmail.com',
    password: 'Password1!',
    accounts: [accountInput, accountInput2]    
};

const userInput: UserInput = { 
    nationalRegisterNumber: '99.01.01-123.44',
    name: 'John Doe',
    birthDate: new Date('2001-01-01'),
    role: 'user',
    phoneNumber: '0123456789',
    email: 'john.do@gmail.com',
    password: 'Password1!',
    accounts: [accountInput, accountInput2]    
};

const userBank = new User({
    ...userInputBank,
    accounts: [],
});

const userAdmin = new User({
    ...userInputAdmin,
    accounts: [account, account2],
});

const user = new User({
    ...userInput,
    accounts: [account, account2, account3],
});

let createAccountMock: jest.Mock;
let mockAccountDbGetAccountById: jest.Mock;
let mockAccountDbGetAccountByAccountNumber: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockAccountDbGetAllAccounts: jest.Mock;
let mockAccountDbGetAccountsOfUser: jest.Mock;
let getAccountDbGetTransactionAccountsOfUser: jest.Mock;
let mockAccountDbDelete: jest.Mock

beforeEach(() => {
    mockUserDbGetUserByEmail = jest.fn();
    mockAccountDbGetAccountByAccountNumber = jest.fn();
    mockAccountDbGetAccountById = jest.fn();
    createAccountMock = jest.fn();
    mockAccountDbGetAllAccounts = jest.fn();
    mockAccountDbGetAccountsOfUser = jest.fn();
    getAccountDbGetTransactionAccountsOfUser = jest.fn();
    mockAccountDbDelete = jest.fn();

    // // Mock Date
    // const mockDate = new Date('2024-11-04T22:54:24.861Z');
    global.Date = jest.fn(() => mockDate) as unknown as DateConstructor;

    // Mock Random Number
    jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

test('given: a valid account, when: creating an account, then: account is created with those values', async () => {
    // Given
    accountDb.createAccount = createAccountMock.mockResolvedValue(account);

    // When
    const result = await accountService.createAccount({ isShared: true, type: 'savings' });

    // Then
    expect(createAccountMock).toHaveBeenCalledTimes(1);
    expect(createAccountMock).toHaveBeenCalledWith(      
        expect.objectContaining({
            isShared: true,
            type: 'savings'
        }));
    expect(result).toEqual(account);
});

test('given: a valid id, when: getting an account by id, then: account is returned', async () => {
    // Given
    accountDb.getAccountById = mockAccountDbGetAccountById.mockResolvedValue(account);

    // When
    const result = await accountService.getAccountById({ id: 1 });

    // Then
    expect(mockAccountDbGetAccountById).toHaveBeenCalledTimes(1);
    expect(mockAccountDbGetAccountById).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(result);
});

test('given: an invalid id, when: getting an account by id, then: error is thrown', async () => {
    // Given
    accountDb.getAccountById = mockAccountDbGetAccountById.mockResolvedValue(null);
    
    // When
    
    const result = accountService.getAccountById({ id: 1 });
    
    // Then
    await expect(result).rejects.toThrow('Account with id: 1 was not found.');
});

test('given: a valid account number, when: getting an account by account number, then: account is returned', async () => {
    // Given
    accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber.mockResolvedValue(account);
    
    // When
    const result = await accountService.getAccountByAccountNumber(accountInput.accountNumber);

    // Then
    expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledTimes(1);
    expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledWith(accountInput.accountNumber);
    expect(result).toEqual(account);
});

test('given: an invalid account number, when: getting an account by account number, then: error is thrown', async () => {
    // Given
    accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber.mockResolvedValue(null);

    // When
    const result = accountService.getAccountByAccountNumber(accountInput.accountNumber);
    

    // Then
    await expect(result).rejects.toThrow(
        `Account with ${accountInput.accountNumber} was not found.`
    );
});


test('given: a valid email of a user with bank role, when: getting accounts of a user, then: all accounts are returned', async () => {
    // given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(userBank);
    accountDb.getAllAccounts = mockAccountDbGetAllAccounts.mockResolvedValue([account, account2, account3]);

    // when
    const result = await accountService.getAccountsOfUser(userInputBank.email);

    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockAccountDbGetAllAccounts).toHaveBeenCalledTimes(1);
    expect(result).toEqual([account, account2, account3])
});


test('given: a valid email of a user with admin role, when: getting accounts of a user, then: all accounts of that user are returned', async () => {
    // given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(userAdmin);
    accountDb.getAccountsOfUser = mockAccountDbGetAccountsOfUser.mockResolvedValue([account, account2]);

    // when
    const result = await accountService.getAccountsOfUser(userInputAdmin.email);

    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockAccountDbGetAccountsOfUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual([account, account2])
});

test('given: a valid email of a user with user role, when: getting accounts of a user, then: only transaction accounts of that user are returned', async () => {
    // given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);
    accountDb.getTransactionAccountsOfUser = getAccountDbGetTransactionAccountsOfUser.mockResolvedValue([account2]);

    // when
    const result = await accountService.getAccountsOfUser(userInput.email);

    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(getAccountDbGetTransactionAccountsOfUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual([account2])
});


test('given: an invalid email of a user, when: getting accounts of a user, then: an error is thrown', async () => {
    // given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(null);

    // when
    const result = accountService.getAccountsOfUser(userInputAdmin.email);

    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toThrow("No user was found.")
});

test('given: a valid accountnumber, when: when deleting account, then: accounts is deleted', async () => {
    // given
    accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber.mockResolvedValue(account);
    accountDb.deleteAccount = mockAccountDbDelete.mockResolvedValue(undefined);

    // when
    const result = await accountService.deleteAccount(accountInput.accountNumber);

    expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledTimes(1);
    expect(mockAccountDbDelete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(undefined);
});

test('given: an invalid accountnumber, when: when deleting account, then: an error is thrown', async () => {
    // given
    accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber.mockResolvedValue(null);

    // when
    const result = accountService.deleteAccount(accountInput.accountNumber);

    expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledTimes(1);
    expect(result).rejects.toThrow(`Account with account number ${accountInput.accountNumber} was not found.`);
});