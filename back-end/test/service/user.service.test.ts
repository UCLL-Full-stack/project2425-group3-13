import { User } from '../../model/user';
import { Account } from '../../model/account';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import accountService from '../../service/account.service';
import { AccountInput, UserInput } from '../../types';
import bcrypt from 'bcrypt';
import accountDb from '../../repository/account.db';

const password = 'Password1!';
const hashedPasswd = bcrypt.hashSync(password, 10);

const accountInput: AccountInput = {
    accountNumber: '20241104-SAV-370',
    isShared: false,
    type: 'transaction',
    balance: 0,
    startDate: new Date(),
    endDate: null,
    status: 'Active',
    transactions: [],
};

const account = new Account({
    ...accountInput,
    transactions: []
});

const userInput: UserInput = { 
    nationalRegisterNumber: '99.01.01-123.44',
    name: 'John Doe',
    birthDate: new Date('2001-01-01'),
    role: 'admin',
    phoneNumber: '0123456789',
    email: 'john.doe@gmail.com',
    password: password,
    accounts: []    
};

const userInputWithAccount: UserInput = { 
    nationalRegisterNumber: '99.01.01-123.44',
    name: 'John Doe',
    birthDate: new Date('2001-01-01'),
    role: 'admin',
    phoneNumber: '0123456789',
    email: 'john.doe@gmail.com',
    password: password,
    accounts: [accountInput]    
};

const user = new User({
    ...userInput,
    accounts: [],
});

const userWithAccount = new User({
    ...userInputWithAccount,
    accounts: [account],
})

let createUserMock: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockUserDbGetUserByNationalRegisterNumber: jest.Mock;
let mockUserDbAddAccount: jest.Mock;
let mockAccountDbGetAccountByAccountNumber: jest.Mock;

beforeEach(() => {
    mockUserDbGetUserByEmail = jest.fn();
    mockUserDbGetUserByNationalRegisterNumber = jest.fn();
    createUserMock = jest.fn();
    mockUserDbAddAccount = jest.fn();
    mockAccountDbGetAccountByAccountNumber = jest.fn();
    
    jest.mock('bcryptjs', () => ({
        compare: jest.fn(),
    }));
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

test('given: a valid user, when: creating a user, then: user is created with those values', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValue(null);
    userDb.createUser = createUserMock.mockResolvedValue(user);

    // When
    await userService.createUser(userInput);

    // Then
    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(createUserMock).toHaveBeenCalledWith({
        ...user,
        password: expect.anything(),
    });
});



test('given: a user with existing national register number, when: creating a user, then: error is thrown', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValue(user);

    // When
    const createUser = userService.createUser(userInput);

    // Then
    await expect(createUser).rejects.toThrow(
        `User with national register number ${userInput.nationalRegisterNumber} already exists.`
    );
});


// test('given: a valid email and password, when: trying to authenticate a user, then: a token with specific values is returned', async () => {
//     // Given
//     userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);
//     // (bcrypt.compare as jest.Mock).mockResolvedValue(true);
//     const isPasswordValid = await bcrypt.compare(hashedPasswd, user.getPassword());

//     // When
//     const result = await userService.authenticate(userInput);

//     // Then
//     expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
//     expect(mockUserDbGetUserByEmail).toHaveBeenCalledWith(userInput.email);
//     expect(isPasswordValid === true);
//     expect(result).toEqual({
//         token: expect.anything(), 
//         id: user.getId(),
//         email: userInput.email,
//         name: user.getName(),
//         nationalRegisterNumber: user.getNationalRegisterNumber(),
//     });
// });

test('given: an invalid email and password, when: getting a user by email and password, then: error is thrown', async () => {
    // Given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(null);
    
    // When
    const result = userService.authenticate(userInput);

    // Then
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toThrow('Invalid email or password.');
});

test('given: a valid email, when: getting a user by email, then: user is returned', async () => {
    // Given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);

    // When
    const result = await userService.getUserByEmail(userInput.email);

    // Then
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledWith(userInput.email);
    expect(result).toEqual(user);
});

test('given: an invalid email, when: getting a user by email, then: error is thrown', async () => {
    // Given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(null);

    // When
    const result = userService.getUserByEmail(userInput.email);

    // Then
    await expect(result).rejects.toThrow('User with email john.doe@gmail.com not found.');
});

test('given: a valid national register number, when: getting a user by national register number, then: user is returned', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValue(user);

    // When
    const result = await userService.getUserByNationalRegisterNumber(userInput.nationalRegisterNumber);

    // Then
    expect(mockUserDbGetUserByNationalRegisterNumber).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByNationalRegisterNumber).toHaveBeenCalledWith(userInput.nationalRegisterNumber);
    expect(result).toEqual(user);
});

test('given: an invalid national register number, when: getting a user by national register number, then: error is thrown', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValue(null);

    // When
    const result = userService.getUserByNationalRegisterNumber(userInput.nationalRegisterNumber);

    // Then
    await expect(result).rejects.toThrow('User with national register number 99.01.01-123.44 not found.');
});

test('given: a valid national register number and account number, when: adding an account, then: account is added to user', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValue(user);
    accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber.mockResolvedValue(account);
    userDb.addAccount = mockUserDbAddAccount.mockResolvedValue(userWithAccount);

    // When
    const result = await userService.addAccount(userInput.nationalRegisterNumber, accountInput.accountNumber);

    // Then
    expect(mockUserDbGetUserByNationalRegisterNumber).toHaveBeenCalledWith(userInput.nationalRegisterNumber);
    expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledWith(accountInput.accountNumber);
    expect(result).toEqual(userWithAccount);
});

test('given: an invalid national register number, when: adding an account, then: error is thrown', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValue(null);

    // When
    const result = userService.addAccount(userInput.nationalRegisterNumber, accountInput.accountNumber);

    // Then
    await expect(result).rejects.toThrow('User with national register number 99.01.01-123.44 not found.');
});

test('given: an invalid account number, when: adding an account, then: error is thrown', async () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockResolvedValueOnce(user);
    accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber.mockResolvedValueOnce(null);

    // When
    const result = userService.addAccount(userInput.nationalRegisterNumber, accountInput.accountNumber);

    // Then
    await expect(result).rejects.toThrow('Account with account number 20241104-SAV-370 not found.');
});