import { User } from '../model/user';
import { Account } from '../model/account';
import { Transaction } from '../model/transaction';
import database from '../util/database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({ include: { accounts: true } });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        console.log('Creating user with data:', {
            nationalRegisterNumber: user.getNationalRegisterNumber(),
            name: user.getName(),
            birthDate: user.getBirthDate(),
            isAdministrator: user.getIsAdministrator(),
            phoneNumber: user.getPhoneNumber(),
            email: user.getEmail(),
            password: user.getPassword(),
        });

        const userPrisma = await database.user.create({
            data: {
                nationalRegisterNumber: user.getNationalRegisterNumber(),
                name: user.getName(),
                birthDate: user.getBirthDate(),
                isAdministrator: user.getIsAdministrator(),
                phoneNumber: user.getPhoneNumber(),
                email: user.getEmail(),
                password: user.getPassword(),
            },
            include: { accounts: true },
        });

        return User.from(userPrisma);
    } catch (error: any) {
        console.error('Database error:', error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByNationalRegisterNumber = async (
    nationalRegisterNumber: string
): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                nationalRegisterNumber: nationalRegisterNumber,
            },
            include: { accounts: { include: { expense: true, income: true } } },
        });
        if (userPrisma) {
            return User.from(userPrisma);
        } else {
            return null;
        }
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                email: email,
            },
            include: { accounts: { include: { expense: true, income: true } } },
        });

        if (userPrisma) {
            return User.from(userPrisma);
        } else {
            return null;
        }
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const updateUser = async (updatedUser: User): Promise<User> => {
    try {
        const updatedPrisma = await database.user.update({
            where: {
                nationalRegisterNumber: updatedUser.getNationalRegisterNumber(),
            },
            data: {
                nationalRegisterNumber: updatedUser.getNationalRegisterNumber(),
                name: updatedUser.getName(),
                birthDate: updatedUser.getBirthDate(),
                isAdministrator: updatedUser.getIsAdministrator(),
                phoneNumber: updatedUser.getPhoneNumber(),
                email: updatedUser.getEmail(),
                password: updatedUser.getPassword(),
            },
            include: { accounts: { include: { expense: true, income: true } } },
        });

        return User.from(updatedPrisma);
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const deleteUser = async (nationalRegisterNumber: string): Promise<User> => {
    try {
        const deletedPrisma = await database.user.delete({
            where: {
                nationalRegisterNumber: nationalRegisterNumber,
            },
            include: { accounts: { include: { expense: true, income: true } } },
        });

        return User.from(deletedPrisma);
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const addAccount = async (nationalRegisterNumber: string, accountNumber: string): Promise<User> => {
    try {
        const updatedUser = await database.user.update({
            where: { nationalRegisterNumber },
            data: {
                accounts: {
                    connect: { accountNumber },
                },
            },
            include: { accounts: { include: { expense: true, income: true } } },
        });
        return User.from(updatedUser);
    } catch (error: any) {
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                id: id,
            },
            include: { accounts: { include: { expense: true, income: true } } },
        });

        if (userPrisma) {
            return User.from(userPrisma);
        } else {
            return null;
        }
    } catch (error: any) {
        // throw new Error('Database error. See server log for details.');
        throw new Error(`Database error: ${error.message}`);
    }
};

export default {
    createUser,
    getUserByNationalRegisterNumber,
    getUserByEmail,
    getAllUsers,
    updateUser,
    deleteUser,
    addAccount,
    getUserById,
};
