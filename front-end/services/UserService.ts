import { Authentication, User } from "@/types";

const createUser = async (user :User): Promise<void> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify(user),
    });
}

const getUserByEmailAndPassword = async (credentials: Authentication): Promise<User> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(credentials),
    });

    // if (!response.ok) {
    //     throw new Error('Login failed');
    // }

    const user = await response.json();
    return user;
}

const UserService = {
    createUser,
    getUserByEmailAndPassword
}

export default UserService;