import React, { useState } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import { Authentication } from "@/types";
import styles from '@/styles/Home.module.css';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<Authentication>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const user = await UserService.loginUser(credentials);
      localStorage.setItem("loggedInUser", JSON.stringify({
        token: user.token,
        username: user.username,
        nationalRegisterNumber: user.nationalRegisterNumber
      }));

      if (user && user.nationalRegisterNumber) {
        alert("Login successful!");
        router.push(`/accounts/${user.nationalRegisterNumber}`);
      } else {
        alert("Login failed. User not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  const handleInputChange = (field: keyof Authentication, value: any) => {
    setCredentials({ ...credentials, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <label htmlFor="email">Email <sup>*</sup></label>
      <input 
        type="email"
        id="email"
        name="email"
        value={credentials.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        placeholder="Email"
        autoComplete="email"
        required
      />
      <label htmlFor="password">Password <sup>*</sup></label>
      <input 
        type="password"
        id="password"
        name="password"
        value={credentials.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
