import { set } from 'date-fns';
import { Account } from '../../model/account';
import { Transaction } from '../../model/transaction';
import { Expense } from '../../model/expense';

test('given: valid values for expense, when: creating a expense, then: expense is created with those values', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const expense = new Expense({
        amount: 100,
        currency: 'EUR',
        type: 'expense',
        account,
        destination: 'Groceries',
    });

    //Then
    expect(expense.getAmount()).toEqual(100);
    expect(expense.getCurrency()).toEqual('EUR');
    expect(expense.getType()).toEqual('expense');
    expect(expense.getAccount()).toEqual(account);
    expect(expense.getDestination()).toEqual('Groceries');
});

test('given: zero amount for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createExpense = () => {
        new Expense({
            amount: 0,
            currency: 'EUR',
            type: 'expense',
            account,
            destination: 'Groceries',
        });
    };

    //Then
    expect(createExpense).toThrow('Amount must be greater than 0.');
});

test('given: negative amount for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createExpense = () => {
        new Expense({
            amount: -1,
            currency: 'EUR',
            type: 'expense',
            account,
            destination: 'Groceries',
        });
    };

    //Then
    expect(createExpense).toThrow('Amount must be greater than 0.');
});

test('given: invalid currency for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createExpense = () => {
        new Expense({
            amount: 100,
            currency: 'AUD',
            type: 'expense',
            account,
            destination: 'Groceries',
        });
    };

    //Then
    expect(createExpense).toThrow('Currency must be either USD, EUR or GBP.');
});

test('given: invalid type for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createExpense = () => {
        new Expense({
            amount: 100,
            currency: 'EUR',
            type: 'loan',
            account,
            destination: 'Groceries',
        });
    };

    //Then
    expect(createExpense).toThrow('Type must be either income or expense.');
});
