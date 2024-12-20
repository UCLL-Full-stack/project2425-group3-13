import React, { useState } from 'react';
import { useRouter } from 'next/router';
import TransactionService from '@/services/TransactionService';
import { Transaction } from '@/types';
import styles from '@/styles/Home.module.css';
import useSWR, { mutate } from 'swr';

type TransactionOverviewProps = {
  type: 'user' | 'account';
};

const fetchTransactions = async (type: 'user' | 'account', id: number) => {
  if (type === 'user') {
    return await TransactionService.getTransactionsByUserId(id);
  } else if (type === 'account') {
    return await TransactionService.getTransactionsByAccountId(id);
  }
  return [];
};

const TransactionOverview: React.FC<TransactionOverviewProps> = ({ type }) => {
  const [filterOption, setFilterOption] = useState<string>('amount');
  const [filterValue, setFilterValue] = useState<string>('');
  const router = useRouter();
  const { userId, accountId } = router.query;

  const id = type === 'user' ? Number(userId) : Number(accountId);

  const { data: transactions, error } = useSWR(
    id ? [`transactions`, type, id] : null,
    () => fetchTransactions(type, id)
  );

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
      mutate([`transactions`, type, id], filteredTransactions, false);
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  };

  if (!transactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.accountOverview}>
      <form onSubmit={handleFilterSubmit}>
        <label htmlFor="filterOption">Filter options:</label>
        <select name="filterOption" id="filterOption" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
          <option value="amount">Amount</option>
          <option value="currency">Currency</option>
          <option value="date">Date</option>
          <option value="type">Type</option>
        </select>
        <label htmlFor="filterValue">Filter value:</label>
        {filterOption === 'date' ? (
          <input
            name='filterValue'
            id='filterValue'
            type="date"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter filter value"
          />
        ) : filterOption === 'amount' ? (
          <input
            name='filterValue'
            id='filterValue'
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter filter value"
          />
        ) : (
          <input
            name='filterValue'
            id='filterValue'
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter filter value"
          />
        )}
        <button type="submit">Filter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Reference number</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            <th>Source Account</th>
            <th>Destination Account</th>
            <th>Type</th>
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
              <td colSpan={7}>No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionOverview;