import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home: React.FC = () => {
  const { t } = useTranslation("common"); // Use the "common" namespace

  return (
    <>
      <Head>
        <title>{t("home.title")}</title>
        <meta name="description" content={t("home.metaDescription")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>{t("home.welcomeMessage")}</h1>
        <div>
          <p>{t("home.intro")}</p>
          <ul>
            <li>
              <h2>{t("home.features.multipleAccounts.title")}</h2>
              <p>{t("home.features.multipleAccounts.description")}</p>
            </li>
            <li>
              <h2>{t("home.features.seamlessTransactions.title")}</h2>
              <p>{t("home.features.seamlessTransactions.description")}</p>
            </li>
            <li>
              <h2>{t("home.features.expenseTracking.title")}</h2>
              <p>{t("home.features.expenseTracking.description")}</p>
            </li>
            <li>
              <h2>{t("home.features.secureEnvironment.title")}</h2>
              <p>{t("home.features.secureEnvironment.description")}</p>
            </li>
          </ul>
          <p>{t("home.getStarted")}</p>
        </div>
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

export default Home;
