import { userInfo } from 'os';
import { Account } from '../../model/account';
import accountDb from '../../repository/account.db';
import accountService from '../../service/account.service';
import { AccountInput } from '../../types';

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

const account = new Account({
    ...accountInput,
    transactions: []
});


let createAccountMock: jest.Mock;
let mockAccountDbGetAccountById: jest.Mock;
let mockAccountDbGetAccountByAccountNumber: jest.Mock;

beforeEach(() => {
    mockAccountDbGetAccountByAccountNumber = jest.fn();
    mockAccountDbGetAccountById = jest.fn();
    createAccountMock = jest.fn();

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
    const result = await accountService.createAccount({ isShared: false, type: 'savings' });

    // Then
    expect(createAccountMock).toHaveBeenCalledTimes(1);
    expect(createAccountMock).toHaveBeenCalledWith(      
        expect.objectContaining({
            isShared: false,
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
