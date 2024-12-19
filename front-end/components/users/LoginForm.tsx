import React, { useState } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import { Authentication } from "@/types";
import styles from '@/styles/Home.module.css';
import { useTranslation } from "next-i18next";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
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
        id: user.id,
        username: user.name,
        email: user.email,
        nationalRegisterNumber: user.nationalRegisterNumber
      }));

      if (user && user.nationalRegisterNumber) {
        alert("Login successful!");
        router.push(`/accounts/${user.nationalRegisterNumber}`);
      } else {
        alert("Login failed. User not found.");
      }
    } catch (error) {
      console.log(credentials);
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
      <label htmlFor="password">{t("userDetails.password")}<sup>*</sup></label>
      <input 
        type="password"
        id="password"
        name="password"
        value={credentials.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        placeholder={t("userDetails.password")}
        autoComplete="current-password"
        required
      />
      <button type="submit">{t("submit.login")}</button>
    </form>
  );
};

export default LoginForm;
