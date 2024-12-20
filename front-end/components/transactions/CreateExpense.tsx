import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AccountService from '../../services/AccountService';
import TransactionService from '../../services/TransactionService';
import styles from '../../styles/Home.module.css';
import { Account } from '@/types';
import { create } from 'domain';
import { useTranslation } from 'next-i18next';
import exp from 'constants';

const CreateExpense: React.FC = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('EUR');
  const [destinationAccountNumber, setDestinationAccountNumber] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { accountNumber } = router.query;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const expenseData = {
      amount,
      currency,
      destinationAccountNumber,
    };

    let destinationAccount: Account | undefined;
    if (destinationAccountNumber.trim().length !== 0) {
      const account = await AccountService.getAccountByAccountNumber(destinationAccountNumber);
      destinationAccount = account;
    }

    if (typeof accountNumber === 'string') {
      try {
        const sourceAccount = await AccountService.getAccountByAccountNumber(accountNumber);
        const result = await TransactionService.createExpense(accountNumber as string, expenseData);

        alert('Expense created successfully!');
        router.push(`/transactions/overview/account/${sourceAccount.id}`);
      } catch (error: any) {
        if (destinationAccountNumber.trim().length === 0) {
          setError('destination_account_required');
        } else if (!destinationAccount) {
          setError('destination_account_not_found')
        } else if (expenseData.amount <= 0) {
          setError('Amount must be greater than 0.');
        } else {
          setError('account_blocked_or_closed');
        }
      }
    } else {
      setError('invalid_account_number');
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
      {t('form.amount_label')}
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </label>
      <label>
      {t('form.currency_label')}
        <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
      </label>
      <label>
      {t('form.destination_account_label')}
        <input type="text" value={destinationAccountNumber} onChange={(e) => setDestinationAccountNumber(e.target.value)} />
      </label>
      {error && <div className={styles.error}>{t(`messages.${error}`)}</div>}
      <button type="submit">{t('form.submit_button')}</button>
    </form>
  );
};

export default CreateExpense;