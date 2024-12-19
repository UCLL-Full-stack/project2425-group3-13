import { User as UserPrisma, Account as AccountPrisma } from '@prisma/client';
import { UserInput } from '../types';
import { Account } from './account';

export class User {
    private id?: number;
    private nationalRegisterNumber: string;
    private name: string;
    private birthDate: Date;
    private isAdministrator: boolean;
    private phoneNumber: string;
    private email: string;
    private password: string;
    private accounts: Account[];

    constructor(user: {
        id?: number;
        nationalRegisterNumber: string;
        name: string;
        birthDate: Date;
        isAdministrator: boolean;
        phoneNumber: string;
        email: string;
        password: string;
        accounts?: Account[];
    }) {
        this.validate(user);
        this.id = user.id;
        this.nationalRegisterNumber = user.nationalRegisterNumber;
        this.name = user.name;
        this.birthDate = user.birthDate;
        this.isAdministrator = user.isAdministrator;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.password = user.password;
        this.accounts = user.accounts || [];
    }

    getId(): number | undefined {
        return this.id;
    }

    getNationalRegisterNumber(): string {
        return this.nationalRegisterNumber;
    }

    getName(): string {
        return this.name;
    }

    getBirthDate(): Date {
        return this.birthDate;
    }

    getIsAdministrator(): boolean {
        return this.isAdministrator;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getAccounts(): Account[] {
        return this.accounts;
    }

    validate(user: {
        id?: number;
        nationalRegisterNumber: string;
        name: string;
        birthDate: Date;
        isAdministrator: boolean;
        phoneNumber: string;
        email: string;
        password: string;
    }) {
        if (!user.nationalRegisterNumber?.trim()) {
            throw new Error('National register number is required.');
        } else if (!this.validateNRN(user.nationalRegisterNumber)) {
            throw new Error('National register number is not correct.');
        }

        // Validate name
        if (!user.name?.trim()) {
            throw new Error('Name is required.');
        }

        // Validate birth date
        if (user.birthDate > new Date()) {
            throw new Error('Birth date cannot be in the future.');
        }

        if (!user.phoneNumber?.trim()) {
            throw new Error('Phone number is required.');
        } else if (!this.validatePhone(user.phoneNumber)) {
            throw new Error('Phone pattern is not valid.');
        }

        if (!user.email?.trim()) {
            throw new Error('Email is required.');
        } else if (!this.emailPattern(user.email)) {
            throw new Error('Email pattern is not valid.');
        }

        // Validate password
        if (!user.password?.trim()) {
            throw new Error('Password is required.');
        } else if (user.password.length < 8) {
            throw new Error('Password must be at least 8 characters long.');
        } else if (!/[A-Z]/.test(user.password)) {
            throw new Error('Password must contain at least one uppercase letter.');
        } else if (!/[a-z]/.test(user.password)) {
            throw new Error('Password must contain at least one lowercase letter.');
        } else if (!/[0-9]/.test(user.password)) {
            throw new Error('Password must contain at least one number.');
        } else if (!/[!@#\$%\^&\*]/.test(user.password)) {
            throw new Error('Password must contain at least one special character (!@#$%^&*).');
        }
    }

    validateNRN(nrn: string): boolean {
        // Dagen en maand moet nog gecorrigeerd worden
        const nrnPattern =
            /^([0-9]{2})\.([0][1-9]|[1][1_2])\.([0-2][0-9]|[3][01])\-([0-9]{3})\.([0-9]{2})$/;

        return nrnPattern.test(nrn);
    }

    validatePhone(phone: string): boolean {
        const phonePattern = /^(?:(?:\+32|0)\s?)?(?:[1-9]{1}\d{1})(?:[\s.-]?\d{2,3}){3}$/;

        return phonePattern.test(phone);
    }

    emailPattern(email: string): boolean {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailPattern.test(email);
    }

    addAccount(account: Account): void {
        if (this.accounts.find((acc) => acc.getAccountNumber() === account.getAccountNumber())) {
            throw new Error(
                `Account with account number ${account.getAccountNumber()} has already been added to this user.`
            );
        }
        this.accounts.push(account);
    }

    toJSON() {
        return {
            id: this.id,
            nationalRegisterNumber: this.nationalRegisterNumber,
            name: this.name,
            birthDate: this.birthDate,
            isAdministrator: this.isAdministrator,
            phoneNumber: this.phoneNumber,
            email: this.email,
            accounts: this.accounts.map((account) => account.toJSON()),
        };
    }

    update(userInput: Partial<UserInput>) {
        if (userInput.name) this.name = userInput.name;
        if (userInput.phoneNumber) this.phoneNumber = userInput.phoneNumber;
        if (userInput.email) this.email = userInput.email;
        if (userInput.password) this.password = userInput.password;
    }

    removeAccount(account: Account): void {
        const accountIndex = this.accounts.findIndex(
            (account) => account.getAccountNumber() === account.getAccountNumber()
        );
        if (accountIndex === -1) {
            throw new Error(`Account with account number ${account.getAccountNumber()} not found.`);
        }
        this.accounts.splice(accountIndex, 1);
    }

    static from({
        id,
        nationalRegisterNumber,
        name,
        birthDate,
        isAdministrator,
        phoneNumber,
        email,
        password,
        accounts,
    }: UserPrisma & { accounts: AccountPrisma[] }) {
        return new User({
            id,
            nationalRegisterNumber,
            name,
            birthDate,
            isAdministrator,
            phoneNumber,
            email,
            password,
            accounts: accounts.map((account) => Account.from({ ...account })),
        });
    }
}
