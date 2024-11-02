import { get } from 'http';
import { User } from '../model/user';

const users: User[] = [];

const createUser = ({
    nationalRegisterNumber,
    name,
    birthDate,
    isAdministrator,
    phoneNumber,
    email,
    password,
}: User): User => {
    const existingUser = getUserByNationalRegisterNumber(nationalRegisterNumber);
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
    users.push(user);
    return user;
};

const getUserByNationalRegisterNumber = (nationalRegisterNumber: string): User | undefined => {
    return users.find((user) => user.getNationalRegisterNumber() === nationalRegisterNumber);
};

const getUserByEmail = (email: string): User | undefined => {
    return users.find((user) => user.getEmail() === email);
};

export default {
    createUser,
    getUserByNationalRegisterNumber,
    getUserByEmail,
};
