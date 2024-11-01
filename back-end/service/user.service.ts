import { User } from "../model/user";
import { UserInput } from '../types';
import accountService from "./account.service";

const createUser = ({nationalRegisterNumber, name, isAdministrator, phoneNumber, email, password}: UserInput): User => {
    const user = new User({nationalRegisterNumber, name, isAdministrator, phoneNumber, email, password, accounts: []});
    return user;
}

export default {
    createUser
};