import { set } from 'date-fns';
import { Account } from '../../model/account';
import { User } from '../../model/user';
import { Transaction } from '../../model/transaction';

const user = new User({
    nationalRegisterNumber: '01.01.01-001.01',
    name: 'John Doe',
    birthDate: new Date('1990-01-01T00:00:00.000Z'),
    isAdministrator: true,
    phoneNumber: '012345678',
    email: 'john.doe@gmail.com',
    password: 'Password1!',
});

test('given: valid values for expense, when: creating a expense, then: expense is created with those values', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });
    const destinationAccount = new Account({ isShared: false, type: 'Transaction', users: [user] });

    // When
    const transaction = new Transaction({
        amount: 100,
        currency: 'EUR',
        sourceAccount: sourceAccount,
        destinationAccount: destinationAccount,
        type: 'expense',
    });

    // Then
    expect(transaction.getAmount()).toEqual(100);
    expect(transaction.getCurrency()).toEqual('EUR');
    expect(transaction.getTransactionType()).toEqual('expense');
    expect(transaction.getSourceAccount()).toEqual(sourceAccount);
    expect(transaction.getDestinationAccount()).toEqual(destinationAccount);
    expect(transaction.getDate().getTime()).toBeCloseTo(new Date().getTime(), -2);
});

test('given: zero amount for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });
    const destinationAccount = new Account({ isShared: false, type: 'Transaction', users: [user] });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 0,
            currency: 'EUR',
            sourceAccount: sourceAccount,
            destinationAccount: destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Amount must be greater than 0.');
});

test('given: negative amount for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });
    const destinationAccount = new Account({ isShared: false, type: 'Transaction', users: [user] });

    // When
    const createExpense = () => {
        new Transaction({
            amount: -1,
            currency: 'EUR',
            sourceAccount,
            destinationAccount: destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Amount must be greater than 0.');
});

test('given: invalid currency for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });
    const destinationAccount = new Account({ isShared: false, type: 'Transaction', users: [user] });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: 'AUD',
            sourceAccount,
            destinationAccount: destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Currency must be either USD, EUR or GBP.');
});

test('given: empty destination for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: 'EUR',
            sourceAccount,
            destinationAccount: undefined,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Destination account is required');
});

test('given: empty amount for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });
    const destinationAccount = new Account({
        isShared: false,
        type: 'Transaction',
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: undefined,
            currency: 'EUR',
            sourceAccount,
            destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Amount is required.');
});

test('given: empty currency for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });
    const destinationAccount = new Account({
        isShared: false,
        type: 'Transaction',
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: undefined,
            sourceAccount,
            destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Currency is required.');
});

test('given: empty source account for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const destinationAccount = new Account({
        isShared: false,
        type: 'Transaction',
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: 'EUR',
            sourceAccount: undefined,
            destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Source account is required.');
});

test('given: empty source account for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const destinationAccount = new Account({
        isShared: false,
        type: 'Transaction',
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: 'EUR',
            sourceAccount: undefined,
            destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Source account is required.');
});

test('given: insufficient funds for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 0,
        users: [user],
    });
    const destinationAccount = new Account({
        isShared: false,
        type: 'Transaction',
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: 'EUR',
            sourceAccount,
            destinationAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Insufficient funds.');
});

test('given: insufficient funds for expense, when: creating a expense, then: an error is thrown', () => {
    // Given
    const sourceAccount = new Account({
        isShared: false,
        type: 'Savings',
        balance: 100,
        users: [user],
    });

    // When
    const createExpense = () => {
        new Transaction({
            amount: 100,
            currency: 'EUR',
            sourceAccount,
            destinationAccount: sourceAccount,
            type: 'expense',
        });
    };

    // Then
    expect(createExpense).toThrow('Source and destination accounts must be different.');
});
