import { User } from '../../model/user';

test('given: valid values for user, when: creating a user, then: user is created with those values', () => {
    // Given

    // When
    const user = new User({
        nationalRegisterNumber: '01.01.01-001.01',
        name: 'John Doe',
        birthDate: new Date('1990-01-01'),
        role: 'admin',
        phoneNumber: '012345678',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });

    //Then
    expect(user.getNationalRegisterNumber()).toEqual('01.01.01-001.01');
    expect(user.getName()).toEqual('John Doe');
    expect(user.getBirthDate()).toEqual(new Date('1990-01-01'));
    expect(user.getRole()).toEqual('admin');
    expect(user.getPhoneNumber()).toEqual('012345678');
    expect(user.getEmail()).toEqual('john.doe@gmail.com');
    expect(user.getPassword()).toEqual('Password1!');
    expect(user.getAccounts()).toEqual([]);
});

test('given: blank nationalRegisterNumber, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('National register number is required.');
});

test('given: incorrect nationalRegisterNumber, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.0',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('National register number is not correct.');
});

test('given: blank name, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: '',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Name is required.');
});

test('given: future birthDate, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('2990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Birth date cannot be in the future.');
});

test('given: blank phoneNumber, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Phone number is required.');
});

test('given: invalid phoneNumber, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '123',
            email: 'john.doe@gmail.com',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Phone pattern is not valid.');
});

test('given: blank email, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: '',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Email is required.');
});

test('given: invalid email, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@',
            password: 'Password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Email pattern is not valid.');
});

test('given: blank password, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: '',
        });
    };

    // Then
    expect(createUser).toThrow('Password is required.');
});

test('given: short password, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Pass1!',
        });
    };

    // Then
    expect(createUser).toThrow('Password must be at least 8 characters long.');
});

test('given: password without uppercase letter, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'password1!',
        });
    };

    // Then
    expect(createUser).toThrow('Password must contain at least one uppercase letter.');
});

test('given: password without lowercase letter, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'PASSWORD1!',
        });
    };

    // Then
    expect(createUser).toThrow('Password must contain at least one lowercase letter.');
});

test('given: password without number, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password!',
        });
    };

    // Then
    expect(createUser).toThrow('Password must contain at least one number.');
});

test('given: password without special character, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: 'admin',
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password1',
        });
    };

    // Then
    expect(createUser).toThrow('Password must contain at least one special character (!@#$%^&*).');
});

test('given: no role, when: creating a user, then: error is thrown', () => {
    // Given

    // When
    const createUser = () => {
        new User({
            nationalRegisterNumber: '01.01.01-001.01',
            name: 'John Doe',
            birthDate: new Date('1990-01-01'),
            role: undefined,
            phoneNumber: '012345678',
            email: 'john.doe@gmail.com',
            password: 'Password1',
        });
    };

    // Then
    expect(createUser).toThrow('Role is required.');
});
