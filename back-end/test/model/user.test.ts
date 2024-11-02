import { set } from 'date-fns';
import { User } from '../../model/user';

test('given: valid values for user, when: creating a user, then: user is created with those values', () => {
    // Given
    const user = new User({
        nationalRegisterNumber: '01.01.01-001.01',
        name: 'John Doe',
        birthDate: new Date('1990-01-01'),
        isAdministrator: true,
        phoneNumber: '012345678',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
    });

    //Then
    expect(user.getNationalRegisterNumber()).toEqual('01.01.01-001.01');
    expect(user.getName()).toEqual('John Doe');
    expect(user.getBirthDate()).toEqual(new Date('1990-01-01'));
    expect(user.getIsAdministrator()).toEqual(true);
    expect(user.getPhoneNumber()).toEqual('012345678');
    expect(user.getEmail()).toEqual('john.doe@gmail.com');
    expect(user.getPassword()).toEqual('Password1!');
    expect(user.getAccounts()).toEqual([]);
});
