import Header from "@/components/header";
import Footer from "@/components/footer";
import RegisterForm from "@/components/users/RegisterForm";
import UserService from "@/services/UserService";
import { User } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from '@/styles/Home.module.css';
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const RegisterUser: React.FC = () => {
    const { t } = useTranslation();

    const [user, setUser] = useState<User>({
        nationalRegisterNumber: "",
        name: "",
        email: "",
        password: "",
        birthDate: undefined,
        isAdministrator: false,
        phoneNumber: ""
    });

    const router = useRouter();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await UserService.createUser(user);
        alert("User created!");
        router.push("/users/login");
    }

    const handleInputChange = (field: keyof User, value: any) => {
        setUser({ ...user, [field]: value });
    };

    return (
        <>
            <Head>
                <title>{t("register.title")}</title>
                <meta name="description" content="Personal Finance Tracker app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1>{t("register.heading")}</h1>
                <section>
                    {user && (
                        <RegisterForm user={user} handleSubmit={handleSubmit} handleInputChange={handleInputChange}/>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export const getServerSideProps = async (context: any) => {
  const { locale } = context;

  return {
      props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default RegisterUser;