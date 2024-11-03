import Header from "@/components/header";
import LoginForm from "@/components/users/LoginForm";
import UserService from "@/services/UserService";
import { Authentication, User } from "@/types";
import Head from "next/head";
import { useState } from "react";

const LoginUser: React.FC = () => {
    const [credentials, setCredentials] = useState<Authentication>({
        email: "",
        password: ""
    });

    
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await getUserByEmailAndPassword();
    }

    const handleInputChange = (field: keyof User, value: any) => {
        setCredentials({ ...credentials, [field]: value });
    };

    // useEffect(() =>{
    //     if (user) createUser();
    // }, [user]);

    const getUserByEmailAndPassword = async () => {
        console.log(credentials);
        const user = await UserService.getUserByEmailAndPassword(credentials);
        if (user.email === credentials.email && user.password === credentials.password) {
            alert("Login successful!");
        } else {
            alert("Invalid email or password.");
        }
    }

    return (
        <>
        <Head>
            <title>Register form</title>
        </Head>
        <Header />
        <main>
            <h1>Login</h1>
            <section>
            {credentials && (
                        <LoginForm credentials={credentials} handleSubmit={handleSubmit} handleInputChange={handleInputChange}/>
                    )}
            </section>
        </main>
    </>
    );
};

export default LoginUser;