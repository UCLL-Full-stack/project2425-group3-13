import { set } from 'date-fns';
import { Account } from '../../model/account';
import { Transaction } from '../../model/transaction';
import { Income } from '../../model/income';

test('given: valid values for income, when: creating a income, then: income is created with those values', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const income = new Income({
        amount: 100,
        currency: 'EUR',
        type: 'income',
        account,
        source: 'Groceries',
    });

    //Then
    expect(income.getAmount()).toEqual(100);
    expect(income.getCurrency()).toEqual('EUR');
    expect(income.getType()).toEqual('income');
    expect(income.getAccount()).toEqual(account);
    expect(income.getSource()).toEqual('Groceries');
});

test('given: zero amount for income, when: creating a income, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createIncome = () => {
        new Income({
            amount: 0,
            currency: 'EUR',
            type: 'income',
            account,
            source: 'Groceries',
        });
    };

    //Then
    expect(createIncome).toThrow('Amount must be greater than 0.');
});

test('given: negative amount for income, when: creating a income, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createIncome = () => {
        new Income({
            amount: -1,
            currency: 'EUR',
            type: 'income',
            account,
            source: 'Groceries',
        });
    };

    //Then
    expect(createIncome).toThrow('Amount must be greater than 0.');
});

test('given: invalid currency for income, when: creating a income, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createIncome = () => {
        new Income({
            amount: 100,
            currency: 'AUD',
            type: 'income',
            account,
            source: 'Groceries',
        });
    };

    //Then
    expect(createIncome).toThrow('Currency must be either USD, EUR or GBP.');
});

test('given: invalid type for income, when: creating a income, then: an error is thrown', () => {
    // Given
    const account = new Account({ isShared: true, type: 'Savings', users: [] });

    //When
    const createIncome = () => {
        new Income({
            amount: 100,
            currency: 'EUR',
            type: 'loan',
            account,
            source: 'Groceries',
        });
    };

    //Then
    expect(createIncome).toThrow('Type must be either income or expense.');
});
