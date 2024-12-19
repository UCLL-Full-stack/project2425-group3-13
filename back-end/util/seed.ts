import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const generateAccountNumber = (type: string): string => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const accountType = type.substring(0, 3).toUpperCase(); // First 3 letters of type
    const randomNumbers = Math.floor(100 + Math.random() * 900); // Random 3-digit number

    return `${today}-${accountType}-${randomNumbers}`;
};

const generateReferenceNumber = (
    transactionType: string,
    accountNumber: string,
    date: Date
): string => {
    const lastThreeNumbers = accountNumber.slice(-3).split(''); // Last 3 digits of account number with spaces
    const firstThreeLettersType = transactionType.substring(0, 3).toUpperCase(); // First 3 letters of the transaction type
    const year = date.getUTCFullYear().toString(); // Year of the transaction date
    const uniqueNumber = Date.now().toString().slice(-3) + Math.random().toString().substring(2, 5); // Unique number

    return `${firstThreeLettersType}-${lastThreeNumbers}-${year}-${uniqueNumber}`;
};

const main = async () => {
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();
    await prisma.account.deleteMany();

    // Reusable date values
    const startDate1 = set(new Date(), { year: 2023, month: 0, date: 1 });
    const startDate2 = set(new Date(), { year: 2023, month: 2, date: 1 });
    const birthDate1 = set(new Date(), { year: 1992, month: 4, date: 24 });
    const birthDate2 = set(new Date(), { year: 1985, month: 11, date: 10 });

    // Hash passwords
    const alicePassword = await bcrypt.hash('SecureP@ssw0rd', 10);
    const bobPassword = await bcrypt.hash('BobP@ss123!', 10);

    // Create accounts with valid account numbers
    const account1 = await prisma.account.create({
        data: {
            accountNumber: generateAccountNumber('transaction'),
            balance: 1000.0,
            isShared: false,
            startDate: startDate1,
            endDate: null,
            status: 'Active',
            type: 'transaction',
        },
    });

    const account2 = await prisma.account.create({
        data: {
            accountNumber: generateAccountNumber('savings'),
            balance: 500.0,
            isShared: true,
            startDate: startDate2,
            endDate: null,
            status: 'Active',
            type: 'savings',
        },
    });

    // Create users and connect accounts
    const user1 = await prisma.user.create({
        data: {
            nationalRegisterNumber: '92.05.24-123.45',
            name: 'Alice Johnson',
            birthDate: birthDate1,
            isAdministrator: false,
            phoneNumber: '+32475123456',
            email: 'alice.johnson@example.com',
            password: alicePassword,
            accounts: {
                connect: [{ id: account1.id }, { id: account2.id }],
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            nationalRegisterNumber: '85.12.10-987.65',
            name: 'Bob Smith',
            birthDate: birthDate2,
            isAdministrator: false,
            phoneNumber: '+32476123456',
            email: 'bob.smith@example.com',
            password: bobPassword,
            accounts: {
                connect: [{ id: account2.id }],
            },
        },
    });

    // Create transactions
    const transaction1 = await prisma.transaction.create({
        data: {
            referenceNumber: generateReferenceNumber('income', account1.accountNumber, new Date()),
            date: new Date(),
            amount: 100,
            currency: 'EUR',
            type: 'income',
            sourceAccountId: account1.id,
            destinationAccountId: account2.id,
        },
    });

    const transaction2 = await prisma.transaction.create({
        data: {
            referenceNumber: generateReferenceNumber('expense', account2.accountNumber, new Date()),
            date: new Date(),
            amount: 50,
            currency: 'USD',
            type: 'expense',
            sourceAccountId: account2.id,
            destinationAccountId: account1.id,
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
