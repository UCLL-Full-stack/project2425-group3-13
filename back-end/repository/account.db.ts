import { Account } from "../model/account";

const accounts: Account[] = [];

const getAccountById = ({ id }: { id: number }): Account | null => {
    const account = accounts.find(a => a.getId() === id);
    return account ? account : null;
}

export default {getAccountById};