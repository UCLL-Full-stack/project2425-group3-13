import accountDb from '../repository/account.db';
import userDb from '../repository/user.db';
import { Account } from '../model/account';
import { AccountInput, UserInput } from '../types/index';

const createAccount = (accountInput: AccountInput, currentUser: UserInput): Account => {
    const { isShared, type, users: userInputs } = accountInput;

    const allUserInputs = [...userInputs, currentUser];

    if (isShared && allUserInputs.length <= 1) {
        throw new Error('A shared account must have more than one user.');
    }

    if (!isShared && allUserInputs.length !== 1) {
        throw new Error('An individual account must have exactly one user.');
    }

    const users = allUserInputs.map((userInput) => {
        if (!userInput.nationalRegisterNumber) {
            throw new Error('User national register number is required');
        }
        const user = userDb.getUserByNationalRegisterNumber(userInput.nationalRegisterNumber);
        if (!user) {
            throw new Error(
                `User with national register number ${userInput.nationalRegisterNumber} not found`
            );
        }
        return user;
    });

    const account = new Account({ isShared, type, users });
    return accountDb.createAccount(account);
};

const getAccountById = ({ id }: { id: number}): Account => {
    const account = accountDb.getAccountById({ id });
    if (account === null) {
        throw new Error(`Account with id: ${id} was not found.`);
    }

    return account;
}

export default { createAccount, getAccountById };
