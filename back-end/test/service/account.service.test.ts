// import { Account } from '../../model/account';
// import accountDb from '../../repository/account.db';
// import accountService from '../../service/account.service';

// let createAccountMock: jest.Mock;
// let mockAccountDbGetAccountById: jest.Mock;
// let mockAccountDbGetAccountByAccountNumber: jest.Mock;

// beforeEach(() => {
//     mockAccountDbGetAccountByAccountNumber = jest.fn();
//     mockAccountDbGetAccountById = jest.fn();
//     createAccountMock = jest.fn();

//     // Mock Date
//     const mockDate = new Date('2024-11-04T22:54:24.861Z');
//     global.Date = jest.fn(() => mockDate) as unknown as DateConstructor;

//     // Mock Random Number
//     jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
// });

// afterEach(() => {
//     jest.clearAllMocks();
//     jest.restoreAllMocks();
// });

// test('given: a valid account, when: creating an account, then: account is created with those values', () => {
//     // Given
//     accountDb.createAccount = createAccountMock;

//     // When
//     accountService.createAccount({ isShared: false, type: 'Savings' });

//     // Then
//     expect(createAccountMock).toHaveBeenCalledTimes(1);
//     expect(createAccountMock).toHaveBeenCalledWith(
//         expect.objectContaining({
//             isShared: false,
//             type: 'Savings',
//             accountNumber: '20241104-SAV-370',
//             startDate: new Date('2024-11-04T22:54:24.861Z'),
//         })
//     );
// });

// test('given: a valid id, when: getting an account by id, then: account is returned', () => {
//     // Given
//     accountDb.getAccountById = mockAccountDbGetAccountById;
//     const expectedAccount = new Account({ id: 1, isShared: false, type: 'Savings' });
//     mockAccountDbGetAccountById.mockReturnValue(expectedAccount);

//     // When
//     const result = accountService.getAccountById({ id: 1 });

//     // Then
//     expect(mockAccountDbGetAccountById).toHaveBeenCalledTimes(1);
//     expect(mockAccountDbGetAccountById).toHaveBeenCalledWith({ id: 1 });
//     expect(result).toEqual(expectedAccount);
// });

// test('given: an invalid id, when: getting an account by id, then: error is thrown', () => {
//     // Given
//     accountDb.getAccountById = mockAccountDbGetAccountById;
//     mockAccountDbGetAccountById.mockReturnValue(null);

//     // When
//     const getAccountById = () => {
//         accountService.getAccountById({ id: 1 });
//     };

//     // Then
//     expect(getAccountById).toThrow('Account with id: 1 was not found.');
// });

// test('given: a valid account number, when: getting an account by account number, then: account is returned', () => {
//     // Given
//     accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber;
//     const expectedAccount = new Account({ isShared: false, type: 'Savings' });
//     mockAccountDbGetAccountByAccountNumber.mockReturnValue(expectedAccount);

//     // When
//     const result = accountService.getAccountByAccountNumber('20241104-SAV-370');

//     // Then
//     expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledTimes(1);
//     expect(mockAccountDbGetAccountByAccountNumber).toHaveBeenCalledWith('20241104-SAV-370');
//     expect(result).toEqual(expectedAccount);
// });

// test('given: an invalid account number, when: getting an account by account number, then: error is thrown', () => {
//     // Given
//     accountDb.getAccountByAccountNumber = mockAccountDbGetAccountByAccountNumber;
//     mockAccountDbGetAccountByAccountNumber.mockReturnValue(undefined);

//     // When
//     const getAccountByAccountNumber = () => {
//         accountService.getAccountByAccountNumber('20241104-SAV-370');
//     };

//     // Then
//     expect(getAccountByAccountNumber).toThrow(
//         'Account with account number: 20241104-SAV-370 was not found.'
//     );
// });
