import userDb from '../repository/user.db';
import { User } from '../model/user';
import { UserInput } from '../types/index';

const createUser = ({
    nationalRegisterNumber,
    name,
    birthDate,
    isAdministrator,
    phoneNumber,
    email,
    password,
}: UserInput): User => {
    const existingUser = userDb.getUserByNationalRegisterNumber(nationalRegisterNumber);
    if (existingUser) {
        throw new Error(
            `User with national register number ${nationalRegisterNumber} already exists.`
        );
    }
    const user = new User({
        nationalRegisterNumber,
        name,
        birthDate,
        isAdministrator,
        phoneNumber,
        email,
        password,
    });
    return userDb.createUser(user);
};

const getUserByEmailAndPassword = (email: string, password: string): User | undefined => {
    const user = userDb.getUserByEmailAndPassword(email, password);
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    return userDb.getUserByEmailAndPassword(email, password);
};

const getUserByEmail = (email: string): User | undefined => {
    const user = userDb.getUserByEmail(email);
    if (!user) {
        throw new Error(`User with email ${email} not found.`);
    }
    return userDb.getUserByEmail(email);
};

export default { createUser, getUserByEmailAndPassword, getUserByEmail };
