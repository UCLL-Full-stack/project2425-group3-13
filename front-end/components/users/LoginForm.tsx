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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const user = await UserService.loginUser(credentials);
      localStorage.setItem("loggedInUser", JSON.stringify({
        token: user.token,
        id: user.id,
        username: user.name,
        email: user.email,
        nationalRegisterNumber: user.nationalRegisterNumber,
        role: user.role
      }));

      alert(t("messagesLogin.login_success"));
      router.push(`/accounts/${user.nationalRegisterNumber}`);
    } catch (error: any) {
      console.log(credentials);
      console.error("Login error:", error);
      if (credentials.email.trim().length === 0 || credentials.password.trim().length === 0) {
        setError(t("messagesLogin.email_password_required"));
      } else {
        setError(t("messagesLogin.invalid_credentials"));
      }
    }
  };

  const handleInputChange = (field: keyof Authentication, value: any) => {
    setCredentials({ ...credentials, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="email">email<sup>*</sup></label>
      <input 
        type="email"
        id="email"
        name="email"
        value={credentials.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        placeholder={t("placeholders.email")}
        autoComplete="email"
        required
      />
      <label htmlFor="password">{t("userDetails.password")} <sup>*</sup></label>
      <input 
        type="password"
        id="password"
        name="password"
        value={credentials.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        placeholder={t("placeholders.password")}
        autoComplete="current-password"
        required
      />
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit">{t("submit.login")}</button>
    </form>
  );
};

export default LoginForm;
