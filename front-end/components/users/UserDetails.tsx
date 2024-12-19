import React from 'react';
import { User } from '@/types';
import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';

type Props = { user: User };

const UserDetails: React.FC<Props> = ({ user }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {user && (
        <div>
          <h1>{t("userDetails.welcome", { name: user.name })}!</h1>
          <section className={styles.userDetails}>
            <table>
              <tbody>
                <tr>
                  <td>ID:</td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td>{t("userDetails.name")}:</td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>{t("userDetails.phoneNumber")}:</td>
                  <td>{user.phoneNumber}</td>
                </tr>
                <tr>
                  <td>E-mail:</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>{t("userDetails.nationalRegisterNumber")}:</td>
                  <td>{user.nationalRegisterNumber}</td>
                </tr>
                <tr>
                  <td>{t("userDetails.birthDate")}:</td>
                  <td>{user.birthDate ? new Date(user.birthDate).toDateString() : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      )}
    </>
  );
};

export default UserDetails;
