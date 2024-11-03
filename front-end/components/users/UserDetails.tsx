import React from 'react';
import { User } from '@/types';

type Props = {
  user: User;
};

const UserDetails: React.FC<Props> = ({ user }: Props) => {
  return (
    <>
      {user && (
        <table>
          <tr>
            <td>ID:</td>
            <td>{user.id}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Phone Number:</td>
            <td>{user.phoneNumber}</td>
          </tr>
          <tr>
            <td>E-mail:</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>National Register Number:</td>
            <td>{user.nationalRegisterNumber}</td>
          </tr>
          <tr>
            <td>Birth date:</td>
            <td>{user.birthDate.toDateString()}</td>
          </tr>
        </table>
      )}
    </>
  );
};

export default UserDetails;