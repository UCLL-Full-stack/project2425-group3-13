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
        role: "",
        phoneNumber: ""
    });
    const [errors, setErrors] = useState<{
        nationalRegisterNumber?: string;
        name?: string;
        birthDate?: string;
        phoneNumber?: string;
        email?: string;
        password?: string;
    }>({});
    
    function validateNRN(nrn: string): boolean {
        // Dagen en maand moet nog gecorrigeerd worden
        const nrnPattern =
            /^([0-9]{2})\.([0][1-9]|[1][1_2])\.([0-2][0-9]|[3][01])\-([0-9]{3})\.([0-9]{2})$/;

        return nrnPattern.test(nrn);
    }

    function validatePhone(phone: string): boolean {
        const phonePattern = /^(?:(?:\+32|0)\s?)?(?:[1-9]{1}\d{1})(?:[\s.-]?\d{2,3}){3}$/;

        return phonePattern.test(phone);
    }

    function emailPattern(email: string): boolean {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailPattern.test(email);
    }

    const router = useRouter();

    const validateForm = (user: User) => {
        const newErrors: any = {};

        if (!user.nationalRegisterNumber.trim() || !validateNRN(user.nationalRegisterNumber)) {
            newErrors.nationalRegisterNumber = t("userDetails.nationalRegisterNumberError");
        }

        if (!user.name.trim()) {
            newErrors.name = t("userDetails.nameError");
        }

        if (user.birthDate! > new Date()) {
            newErrors.birthDate = t("userDetails.birthDateError");
        }

        if (!user.phoneNumber.trim() || !validatePhone(user.phoneNumber)) {
            newErrors.phoneNumber = t("userDetails.phoneNumberError");
        }

        if (!user.email.trim() || !emailPattern(user.email)) {
            newErrors.email = t("userDetails.emailError");
        }

        if (!user.password.trim() || user.password.length < 8 || !/[A-Z]/.test(user.password) || !/[a-z]/.test(user.password) || !/[0-9]/.test(user.password) || !/[!@#\$%\^&\*]/.test(user.password)) {
            newErrors.password = t("userDetails.passwordError");
        }

        return newErrors;
    };


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setErrors({});

        try {
            await UserService.createUser(user);
            alert("User created!");
            console.log(errors)
            router.push("/users/login");
        } catch (error: any) {
            const errors = validateForm(user);
            setErrors(errors);
            console.log(errors)
        }
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
                        <RegisterForm user={user} errors={errors}  handleSubmit={handleSubmit} handleInputChange={handleInputChange}/>
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