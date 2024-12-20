import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TransactionService from '@/services/TransactionService';
import { Transaction } from '@/types';
import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';

type TransactionOverviewProps = {
  type: 'user' | 'account';
};

const TransactionOverview: React.FC<TransactionOverviewProps> = ({ type }) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState<string>('amount');
  const [filterValue, setFilterValue] = useState<string>('');
  const router = useRouter();
  const { userId, accountId } = router.query;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let fetchedTransactions: Transaction[] = [];
        if (type === 'user' && userId) {
          fetchedTransactions = await TransactionService.getTransactionsByUserId(Number(userId));
          setTransactions(fetchedTransactions);
        } else if (type === 'account' && accountId) {
          fetchedTransactions = await TransactionService.getTransactionsByAccountId(Number(accountId));
          setTransactions(fetchedTransactions);
        }
      } catch (error: any) {
        alert(t('messagesTransactionOverview.error_loading_transactions'));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [type, userId, accountId, t]);

  const handleFilterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transactionFilter = {
      filterOption,
      filterValue,
    };

    try {
      let filteredTransactions: Transaction[] = [];
      if (type === 'user' && userId) {
        filteredTransactions = await TransactionService.filterUserTransactions(Number(userId), transactionFilter);
      } else if (type === 'account' && accountId) {
        filteredTransactions = await TransactionService.filterAccountTransactions(Number(accountId), transactionFilter);
      }

      setTransactions(filteredTransactions);
    } catch (error: any) {
      alert(t('messagesTransactionOverview.error_filtering_transactions'));
    }
  };

  if (loading) {
    return <div>{t('messagesTransactionOverview.loading')}</div>;
  }

  return (
    <div className={styles.accountOverview}>
      <form onSubmit={handleFilterSubmit}>
        <label htmlFor="filterOption">{t('filter.options_label')}:</label>
        <select
          name="filterOption"
          id="filterOption"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="amount">{t('filter.amount')}</option>
          <option value="currency">{t('filter.currency')}</option>
          <option value="date">{t('filter.date')}</option>
          <option value="type">{t('filter.type')}</option>
        </select>
        <label htmlFor="filterValue">{t('filter.value_label')}:</label>
        {filterOption === 'date' ? (
          <input
            name="filterValue"
            id="filterValue"
            type="date"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={t('filter.enter_value')}
          />
        ) : filterOption === 'amount' ? (
          <input
            name="filterValue"
            id="filterValue"
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={t('filter.enter_value')}
          />
        ) : (
          <input
            name="filterValue"
            id="filterValue"
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={t('filter.enter_value')}
          />
        )}
        <button type="submit">{t('filter.submit_button')}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>{t('table.reference_number')}</th>
            <th>{t('table.amount')}</th>
            <th>{t('table.currency')}</th>
            <th>{t('table.date')}</th>
            <th>{t('table.source_account')}</th>
            <th>{t('table.destination_account')}</th>
            <th>{t('table.type')}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.referenceNumber}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</td>
                <td>{transaction.sourceAccount.accountNumber}</td>
                <td>{transaction.destinationAccount.accountNumber}</td>
                <td>{transaction.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>{t('messagesTransactionOverview.no_transactions_found')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionOverview;
