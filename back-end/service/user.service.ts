import { User } from "../model/user";

const createUser = ({nationalRegisterNumber, name, isAdministrator, phoneNumber, email, password, accounts}: UserInput): User => {
    const user = new User({nationalRegisterNumber, name, isAdministrator, phoneNumber, email, password, accounts)};
    return user;
}

export default {
    createUser
}