import { Account } from '../../model/account';
import { User } from '../../model/user';

const user = new User({
    nationalRegisterNumber: '01.01.01-001.01',
    name: 'John Doe',
    birthDate: new Date('1990-01-01T00:00:00.000Z'),
    role: 'admin',
    phoneNumber: '012345678',
    email: 'john.doe@gmail.com',
    password: 'Password1!',
});

const date = new Date();

test('given: valid values for account, when: creating a account, then: account is created with those values', () => {
    // Given

    // When
    const account = new Account({ isShared: false, type: 'savings'});

    // Then
    expect(account.getIsShared()).toEqual(false);
    expect(account.getType()).toEqual('savings');
    expect(account.getBalance()).toEqual(0);
    expect(account.getStartDate().getTime()).toBeCloseTo(date.getTime(), -2);
    expect(account.getEndDate()).toEqual(null);
    expect(account.getStatus()).toEqual('Active');
    expect(account.getTransactions()).toEqual([]);
    expect(account.getUsers()).toEqual([]);
});


test('given: invalid account type, when: creating a account, then: error is thrown', () => {
    // Given

    // When
    const createAccount = () => {
        new Account({ isShared: false, type: 'Checking' });
    };

    // Then
    expect(createAccount).toThrow(
        'Invalid account type. Valid types are: transaction and savings'
    );
});

test('given: no account type, when: creating an account, then: error is thrown', () => {
    // Given

    // When
    const createAccount = () => {
        new Account({ isShared: false, type: ''});
    };

    // Then
    expect(createAccount).toThrow('Account type is required.');
});

test('given: a negative balance, when: creating an account, then: error is thrown', () => {
    // Given

    // When
    const createAccount = () => {
        new Account({ balance: -10, isShared: false, type: ''});
    };

    // Then
    expect(createAccount).toThrow('Balance must be greater than or equal to 0.');
});

test('given: a invalid type, when: calculating balance, then: error is thrown', () => {
    // Given
    const amount: number = 10;
    const type: string = 'wrong';
    const newAccount: Account = new Account({ balance: 100, isShared: false, type: 'transaction'});
    
    // When
    const calculateBalance = () => newAccount.calculateBalance(amount, type);

    // Then
    expect(calculateBalance).toThrow('Transaction type must be either "income" or "expense".');
});

test('given: a negative balance, when: calculating balance, then: error is thrown', () => {
    // Given
    const amount: number = 50;
    const type: string = 'expense';
    const newAccount: Account = new Account({ balance: 5, isShared: false, type: 'transaction' });

    // When
    const calculateBalance = () => newAccount.calculateBalance(amount, type);

    // Then
    expect(calculateBalance).toThrow("Insufficient funds.");
});

test('given: a valid type, when: calculating balance, then: balance is calculated', () => {
    // Given
    const amount: number = 10;
    const type: string = 'income';
    const newAccount: Account = new Account({ balance: 100, isShared: false, type: 'transaction'});
    
    // When
    const newBalance = newAccount.calculateBalance(amount, type);

    // Then
    expect(newBalance).toEqual(110);
    expect(newAccount.getBalance()).toEqual(110);
});

// test('given: true for isShared and one user, when: creating a account, then: error is thrown', () => {
//     // Given

//     // When
//     const createAccount = () => {
//         new Account({ isShared: true, type: 'savings', users: [user] });
//     };

//     // Then
//     expect(createAccount).toThrow('Shared accounts must have at least two users.');
// });

// test('given: false for isShared and multiple users, when: creating a account, then: error is thrown', () => {
//     // Given
//     const user2 = new User({
//         nationalRegisterNumber: '01.01.01-002.01',
//         name: 'John Doe',
//         birthDate: new Date('1990-01-01T00:00:00.000Z'),
//         isAdministrator: true,
//         phoneNumber: '012345678',
//         email: 'john.doe@gmail.com',
//         password: 'Password1!',
//     });

//     // When
//     const createAccount = () => {
//         new Account({ isShared: false, type: 'savings', users: [user, user2] });
//     };

//     // Then
//     expect(createAccount).toThrow('A personal account can only have one user.');
// });

// test('given: no users, when: creating a account, then: error is thrown', () => {
//     // Given

//     // When
//     const createAccount = () => {
//         new Account({ isShared: false, type: 'savings', users: [] });
//     };

//     // Then
//     expect(createAccount).toThrow('An account must have at least one user.');
// });
