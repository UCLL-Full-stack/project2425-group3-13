import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TransactionService from '@/services/TransactionService';
import { Transaction } from '@/types';
import styles from '@/styles/Home.module.css';

type TransactionOverviewProps = {
  type: 'user' | 'account';
};

const TransactionOverview: React.FC<TransactionOverviewProps> = ({ type }) => {
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
          console.log(`Fetching transactions for user id: ${userId}`);
          fetchedTransactions = await TransactionService.getTransactionsByUserId(Number(userId));
          setTransactions(fetchedTransactions);
        } else if (type === 'account' && accountId) {
          console.log(`Fetching transactions for account id: ${accountId}`);
          fetchedTransactions = await TransactionService.getTransactionsByAccountId(Number(accountId));
          setTransactions(fetchedTransactions);
        } else {
          console.log('No valid id provided in the query');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [type, userId, accountId]);

  const handleFilterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transactionFilter = {
      filterOption,
      filterValue,
    };

    try {
      let filteredTransactions: Transaction[] = [];
      if (type === 'user' && userId) {
        console.log(`Filtering transactions for user id: ${userId}`);
        filteredTransactions = await TransactionService.filterUserTransactions(Number(userId), transactionFilter);
      } else if (type === 'account' && accountId) {
        console.log(`Filtering transactions for account id: ${accountId}`);
        filteredTransactions = await TransactionService.filterAccountTransactions(Number(accountId), transactionFilter);
      } else {
        console.log('No valid id provided in the query');
      }
      console.log('Filtered transactions:', filteredTransactions);
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  };

  if (loading) {
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