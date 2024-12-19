import React from 'react';
import { Account, User } from '@/types';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import AccountService from '@/services/AccountService';
import useSWR, { mutate } from 'swr';
import { useTranslation } from 'next-i18next';

type AccountOverviewProps = {
  // user: User;
  accounts: Account[];
};

const AccountOverview: React.FC<AccountOverviewProps> = ({ accounts }) => {
  const router = useRouter();

  const handleTransactionClick = (accountNumber: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/transactions/${accountNumber}`);
  };

  const handleRowClick = (id: number) => {
    router.push(`/transactions/overview/account/${id}`);
  };
  const { t } = useTranslation();

  return (
    <div className={styles.accountOverview}>
      <table>
        <thead>
          <tr>
            <th>{t("accountOverview.accountNumber")}</th>
            <th>{t("accountOverview.balance")}</th>
            <th>Type</th>
            <th>Status</th>
            <th>{t("accountOverview.startDate")}</th>
            <th>{t("accountOverview.endDate")}</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {accounts && accounts.length > 0 ? (
            accounts.map((account) => (
              <tr key={account.id} onClick={() => account.accountNumber && account.id !== undefined && handleRowClick(account.id)} style={{ cursor: 'pointer' }}>
                <td>{account.accountNumber}</td>
                <td>{account.balance}</td>
                <td>{account.type}</td>
                <td>{account.status}</td>
                <td>{account.startDate ? new Date(account.startDate).toLocaleDateString() : 'N/A'}</td>
                <td>{account.endDate ? new Date(account.endDate).toLocaleDateString() : 'N/A'}</td>
                <td><button onClick={(e) => account.accountNumber && handleTransactionClick(account.accountNumber, e)}>Make transaction</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>{t("accountOverview.noAccounts")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountOverview;