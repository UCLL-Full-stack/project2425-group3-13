import { Account } from "../model/account";
import accountDb from "../repository/account.db";

const getAccountById = ({ id }: { id: number}): Account => {
    const account = accountDb.getAccountById({ id });
    if (account === null) {
        throw new Error(`Account with id: ${id} was not found.`);
    }

    return account;
}
 
export default {getAccountById};