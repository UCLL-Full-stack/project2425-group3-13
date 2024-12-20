import { User } from '../../model/user';
import { Account } from '../../model/account';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import accountService from '../../service/account.service';
import { AccountInput } from '../../types';

const accountInput: AccountInput = {
    isShared: false,
    type: 'Savings',
};

const account = new Account({
    ...accountInput,
});

let createUserMock: jest.Mock;
let mockUserDbGetUserByEmailAndPassword: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockUserDbGetUserByNationalRegisterNumber: jest.Mock;
let mockUserServiceAddAccount: jest.Mock;
let mockAccountServiceGetAccountByAccountNumber: jest.Mock;

beforeEach(() => {
    mockUserDbGetUserByEmailAndPassword = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
    mockUserDbGetUserByNationalRegisterNumber = jest.fn();
    createUserMock = jest.fn();
    mockUserServiceAddAccount = jest.fn();
    mockAccountServiceGetAccountByAccountNumber = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

test('given: a valid user, when: creating a user, then: user is created with those values', () => {
    // Given
    userDb.createUser = createUserMock;

    // When
    userService.createUser({
        nationalRegisterNumber: '99.01.01-123.44',
        name: 'John Doe',
        birthDate: new Date('2001-01-01'),
        role: 'user',
        phoneNumber: '0123456789',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });

    // Then
    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(createUserMock).toHaveBeenCalledWith(
        expect.objectContaining({
            nationalRegisterNumber: '99.01.01-123.44',
            name: 'John Doe',
            birthDate: new Date('2001-01-01'),
            role: 'user',
            phoneNumber: '0123456789',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        })
    );
});

test('given: a user with existing national register number, when: creating a user, then: error is thrown', () => {
    // Given
    userDb.getUserByNationalRegisterNumber =
        mockUserDbGetUserByNationalRegisterNumber.mockReturnValue(
            new User({
                nationalRegisterNumber: '99.01.01-123.45',
                name: 'John Doe',
                birthDate: new Date('2001-01-01'),
                role: 'user',
                phoneNumber: '0123456789',
                email: 'john.doe@gmail.com',
                password: 'Password1!',
            })
        );

    // When
    const createUser = () => {
        userService.createUser({
            nationalRegisterNumber: '99.01.01-123.45',
            name: 'John Doe',
            birthDate: new Date('2001-01-01'),
            role: 'user',
            phoneNumber: '0123456789',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow(
        'User with national register number 99.01.01-123.45 already exists.'
    );
});

test('given: a valid email and password, when: getting a user by email and password, then: user is returned', () => {
    // Given
    userDb.getUserByEmailAndPassword = mockUserDbGetUserByEmailAndPassword.mockClear();
    const expectedUser = new User({
        nationalRegisterNumber: '99.01.01-123.45',
        name: 'John Doe',
        birthDate: new Date('2001-01-01'),
        role: 'user',
        phoneNumber: '0123456789',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });
    mockUserDbGetUserByEmailAndPassword.mockReturnValue(expectedUser);

    // When
    const result = userService.getUserByEmailAndPassword('john.doe@gmail.com', 'Password1!');

    // Then
    expect(mockUserDbGetUserByEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByEmailAndPassword).toHaveBeenCalledWith(
        'john.doe@gmail.com',
        'Password1!'
    );
    expect(result).toEqual(expectedUser);
});

test('given: an invalid email and password, when: getting a user by email and password, then: error is thrown', () => {
    // Given
    userDb.getUserByEmailAndPassword = mockUserDbGetUserByEmailAndPassword.mockClear();
    mockUserDbGetUserByEmailAndPassword.mockReturnValue(undefined);

    // When
    const getUserByEmailAndPassword = () => {
        userService.getUserByEmailAndPassword('john.doe@gmail.com', 'Password1!');
    };

    // Then
    expect(getUserByEmailAndPassword).toThrow('Invalid email or password.');
});

test('given: a valid email, when: getting a user by email, then: user is returned', () => {
    // Given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockClear();
    const expectedUser = new User({
        nationalRegisterNumber: '99.01.01-123.45',
        name: 'John Doe',
        birthDate: new Date('2001-01-01'),
        role: 'user',
        phoneNumber: '0123456789',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });
    mockUserDbGetUserByEmail.mockReturnValue(expectedUser);

    // When
    const result = userService.getUserByEmail('john.doe@gmail.com');

    // Then
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledWith('john.doe@gmail.com');
    expect(result).toEqual(expectedUser);
});

test('given: an invalid email, when: getting a user by email, then: error is thrown', () => {
    // Given
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockClear();
    mockUserDbGetUserByEmail.mockReturnValue(undefined);

    // When
    const getUserByEmail = () => {
        userService.getUserByEmail('john.doe@gmail.com');
    };

    // Then
    expect(getUserByEmail).toThrow('User with email john.doe@gmail.com not found.');
});

test('given: a valid national register number, when: getting a user by national register number, then: user is returned', () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockClear();
    const expectedUser = new User({
        nationalRegisterNumber: '99.01.01-123.45',
        name: 'John Doe',
        birthDate: new Date('2001-01-01'),
        role: 'user',
        phoneNumber: '0123456789',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });
    mockUserDbGetUserByNationalRegisterNumber.mockReturnValue(expectedUser);

    // When
    const result = userService.getUserByNationalRegisterNumber('99.01.01-123.45');

    // Then
    expect(mockUserDbGetUserByNationalRegisterNumber).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByNationalRegisterNumber).toHaveBeenCalledWith('99.01.01-123.45');
    expect(result).toEqual(expectedUser);
});

test('given: an invalid national register number, when: getting a user by national register number, then: error is thrown', () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockClear();
    mockUserDbGetUserByNationalRegisterNumber.mockReturnValue(undefined);

    // When
    const getUserByNationalRegisterNumber = () => {
        userService.getUserByNationalRegisterNumber('99.01.01-123.45');
    };

    // Then
    expect(getUserByNationalRegisterNumber).toThrow(
        'User with national register number 99.01.01-123.45 not found.'
    );
});

test('given: a valid national register number and account number, when: adding an account, then: account is added to user', () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockClear();
    accountService.getAccountByAccountNumber =
        mockAccountServiceGetAccountByAccountNumber.mockClear();

    const user = new User({
        nationalRegisterNumber: '99.01.01-123.45',
        name: 'John Doe',
        birthDate: new Date('2001-01-01'),
        role: 'user',
        phoneNumber: '0123456789',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });

    // Set up mocks to return user and account correctly
    mockUserDbGetUserByNationalRegisterNumber.mockReturnValue(user);
    mockAccountServiceGetAccountByAccountNumber.mockReturnValue(account);

    // Mock user and account methods
    user.addAccount = jest.fn();
    account.addUser = jest.fn();

    // When
    const updatedUser = userService.addAccount('99.01.01-123.45', '20241104-SAV-370');

    // Then
    expect(mockUserDbGetUserByNationalRegisterNumber).toHaveBeenCalledWith('99.01.01-123.45');
    expect(mockAccountServiceGetAccountByAccountNumber).toHaveBeenCalledWith('20241104-SAV-370');
    expect(user.addAccount).toHaveBeenCalledWith(account);
    expect(account.addUser).toHaveBeenCalledWith(user);
    expect(updatedUser).toEqual(user);
});

test('given: an invalid national register number, when: adding an account, then: error is thrown', () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockClear();
    mockUserDbGetUserByNationalRegisterNumber.mockReturnValue(undefined);

    // When
    const addAccount = () => {
        userService.addAccount('99.01.01-123.45', '20241104-SAV-370');
    };

    // Then
    expect(addAccount).toThrow('User with national register number 99.01.01-123.45 not found.');
});

test('given: an invalid account number, when: adding an account, then: error is thrown', () => {
    // Given
    userDb.getUserByNationalRegisterNumber = mockUserDbGetUserByNationalRegisterNumber.mockClear();
    accountService.getAccountByAccountNumber =
        mockAccountServiceGetAccountByAccountNumber.mockClear();

    const user = new User({
        nationalRegisterNumber: '99.01.01-123.45',
        name: 'John Doe',
        birthDate: new Date('2001-01-01'),
        role: 'user',
        phoneNumber: '0123456789',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });

    mockUserDbGetUserByNationalRegisterNumber.mockReturnValue(user);
    mockAccountServiceGetAccountByAccountNumber.mockReturnValue(undefined);

    // When
    const addAccount = () => {
        userService.addAccount('99.01.01-123.45', '20241104-SAV-370');
    };

    // Then
    expect(addAccount).toThrow('Account with account number 20241104-SAV-370 not found.');
});
