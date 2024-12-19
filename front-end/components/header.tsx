import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import Language from "./language/Language";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [nationalRegisterNumber, setNationalRegisterNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (loggedInUser.nationalRegisterNumber) {
      setNationalRegisterNumber(loggedInUser.nationalRegisterNumber);
      setUserId(loggedInUser.id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setNationalRegisterNumber(null);
    setUserId(null);
  };

  return (
    <header className={styles.header}>
      <a>{t("title")}</a>
      <nav>
        {nationalRegisterNumber ? (
          <>
            <Link href={`/users/settings/${nationalRegisterNumber}`}>Settings</Link>
            <Link href={`/transactions/overview/user/${userId}`}>Transaction overview</Link>
            <Link href={`/accounts/${nationalRegisterNumber}`}>Accounts</Link>
            <a href="/" onClick={handleLogout}>Log out</a>
            <Language />
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/users/register">Register</Link>
            <Link href="/users/login">Login</Link>
            <Language />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
