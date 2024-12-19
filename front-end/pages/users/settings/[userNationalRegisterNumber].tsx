import Footer from "@/components/footer";
import Header from "@/components/header";
import Settings from "@/components/users/settingsTab";
import AccountService from "@/services/AccountService";
import UserService from "@/services/UserService";
import { User } from "@/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const settings: React.FC = () => {
    const [user, setUser] = useState<User | null>(null)
    // const router = useRouter();
    // const { userNationalRegisterNumber } = router.query;
    
    const fetchUser = async () => {
        try {
          const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
          console.log("Logged In User:", loggedInUser);
  
          if (!loggedInUser.nationalRegisterNumber) {
            throw new Error("No national register number found in loggedInUser");
          }
  
          const userData = await UserService.getUserByNationalRegisterNumber(
            loggedInUser.nationalRegisterNumber
          );

          setUser(userData);
        } catch (error: any) {
          throw new Error(error);
      }
     };

    useEffect(() => {
        fetchUser();
        // } else {
        //   console.log("No userNationalRegisterNumber provided");
        // }
    }, []);

    const getAccountsForUser = async () => {
      const accounts = await AccountService.getAccountsForUser();
      // console.log(accounts)
      return accounts;
    }
    
    const { data: accounts, error, isLoading } = useSWR('getAccounts', getAccountsForUser);
    
    setInterval(() => {
        mutate("getAccounts", getAccountsForUser());
    }, 480000);
  

    return (
        <>
        <Head>
            <title>Settings</title>
            <meta name="description" content="Personal Finance Tracker app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon/favicon.ico" />
        </Head>
        <Header />
        <main>
            <Settings user={user!} accounts={accounts!}/>
        </main>
        <Footer />
        </>
    )
};

export const getServerSideProps = async (context: any) => {
  const { locale } = context;

  return {
      props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default settings;