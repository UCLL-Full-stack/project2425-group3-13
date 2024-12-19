import userDb from '../repository/user.db';
import { User } from '../model/user';
import { AuthenticationResponse, UserInput } from '../types/index';
import accountService from './account.service';
import accountDb from '../repository/account.db';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';

const getAllUsers = async (): Promise<User[]> => userDb.getAllUsers();

const createUser = async (userInput: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByNationalRegisterNumber(
        userInput.nationalRegisterNumber
    );

    if (existingUser != null) {
        throw new Error(
            `User with national register number ${userInput.nationalRegisterNumber} already exists.`
        );
    }
    const hashedPasswd = await bcrypt.hash(userInput.password, 12);

    const newUser = new User({
        nationalRegisterNumber: userInput.nationalRegisterNumber,
        name: userInput.name,
        birthDate: new Date(userInput.birthDate),
        isAdministrator: userInput.isAdministrator,
        phoneNumber: userInput.phoneNumber,
        email: userInput.email,
        password: hashedPasswd,
    });

    return await userDb.createUser(newUser);
};

const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const existingUser = await userDb.getUserByEmail(email);

    if (existingUser == null) {
        throw new Error('Invalid email or password.');
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }

    const token = generateJwtToken({ email });

    return {
        token,
        id: existingUser.getId(),
        email: email,
        name: existingUser.getName(),
        nationalRegisterNumber: existingUser.getNationalRegisterNumber(),
    };
};

const getUserByEmail = async (email: string): Promise<User> => {
    const user = await userDb.getUserByEmail(email);

    if (user == null) {
        throw new Error(`User with email ${email} not found.`);
    }

    return user;
};

const getUserByNationalRegisterNumber = async (nationalRegisterNumber: string): Promise<User> => {
    const user = await userDb.getUserByNationalRegisterNumber(nationalRegisterNumber);

    if (user == null) {
        throw new Error(`User with national register number ${nationalRegisterNumber} not found.`);
    }

    return user;
};

const addAccount = async (nationalRegisterNumber: string, accountNumber: string): Promise<User> => {
    const user = await userDb.getUserByNationalRegisterNumber(nationalRegisterNumber);
    const account = await accountDb.getAccountByAccountNumber(accountNumber);

    if (user == null) {
        throw new Error(`User with national register number ${nationalRegisterNumber} not found.`);
    }
    if (!account) {
        throw new Error(`Account with account number ${accountNumber} not found.`);
    }

    // user.addAccount(account);
    // account.addUser(user);

    return await userDb.addAccount(nationalRegisterNumber, accountNumber);
};

const updateUser = async (nationalRegisterNumber: string, userInput: UserInput): Promise<User> => {
    const user = await userDb.getUserByNationalRegisterNumber(nationalRegisterNumber);

    if (user == null) {
        throw new Error(`User with national register number ${nationalRegisterNumber} not found.`);
    }

    user.update({
        name: userInput.name,
        phoneNumber: userInput.phoneNumber,
        email: userInput.email,
        password: userInput.password,
    });

    return await userDb.updateUser(user);
};

const deleteUser = async (nationalRegisterNumber: string): Promise<User> => {
    const user = await userDb.getUserByNationalRegisterNumber(nationalRegisterNumber);

    if (user == null) {
        throw new Error(`User with national register number ${nationalRegisterNumber} not found.`);
    } else if (user.getAccounts().length > 0) {
        throw new Error(
            `User with national register number ${nationalRegisterNumber} still has active bank accounts.` // need to change when account status is implemented
        );
    }

    // await userDb.deleteUser(nationalRegisterNumber);
    // return 'User deleted successfully.';
    return await userDb.deleteUser(nationalRegisterNumber);
};

export default {
    getAllUsers,
    createUser,
    authenticate,
    getUserByEmail,
    getUserByNationalRegisterNumber,
    addAccount,
    updateUser,
    deleteUser,
};
