import { User } from "../model/user";

const users: User[] = [];

const getAllUsers = (): User[] => {
    return users;
}

// Sign in
const createUser = (user: User): User => {
    users.push(user);

    return user;
}

export default {
    getAllUsers,
    createUser
}