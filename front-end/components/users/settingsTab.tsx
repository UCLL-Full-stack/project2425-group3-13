import { Account, User } from "@/types";
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import UserService from "@/services/UserService";
import AccountService from "@/services/AccountService";

type Props = { 
  user: User 
  accounts: Account[]
};

const Settings: React.FC<Props> = ({ user, accounts }: Props) => {
  const { t } = useTranslation();
  const [updatedUser, setUpdatedUser] = useState<User>(user);
  const [updatedAccountStatus, setUpdatedAccountStatus] = useState<Account | null>(null);
  const [updatedAccounts, setUpdatedAccounts] = useState<Account[]>(accounts);
  const [type, setType] = useState('password');
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
  }>({});

  const handleUserInputChange = (field: keyof User, value: any) => {
    setUpdatedUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAccountSelection = (account: Account) => {
    setUpdatedAccountStatus(account);
  };

  const handleAccountInputChange = (field: keyof Account, value: any) => {
    if (updatedAccountStatus) {
      const updatedStatus = { ...updatedAccountStatus, [field]: value };

      setUpdatedAccountStatus(updatedStatus);

      const updatedAccountsList = updatedAccounts.map((account) =>
        account.id === updatedStatus.id ? { ...account, status: value } : account
      );
      setUpdatedAccounts(updatedAccountsList);
    }
  };


  const updateUser = async () => {
    await UserService.updateUser(user.nationalRegisterNumber, updatedUser);
  } 

  const updateAccount = async () => {
    console.log(user);
    await AccountService.updateAccount(updatedAccountStatus!);
  }

  const handleDeleteAccount = async (accountNumber: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await AccountService.deleteAccount(accountNumber);
    const updatedAccountsList = updatedAccounts.filter((account) => account.accountNumber !== accountNumber);
    setUpdatedAccounts(updatedAccountsList);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    try {
      if (updatedAccountStatus) {
        await updateAccount();
      }
      await updateUser();
      console.log('Updated User:', updatedUser);
    } catch (error: any) {
      const errors = validateUserInput(updatedUser);
      setErrors(errors);
    }
  };

  useEffect(() => {
    if (accounts) setUpdatedAccounts(accounts);
    setUpdatedUser(user);
  }, [user, accounts]);

  const togglePassword = () => {
    if (type === "password") {
      setType("text");
      
    } else {
      setType("password");
    }
  };

  function validatePhone(phone: string): boolean {
      const phonePattern = /^(?:(?:\+32|0)\s?)?(?:[1-9]{1}\d{1})(?:[\s.-]?\d{2,3}){3}$/;

      return phonePattern.test(phone);
  }

  function emailPattern(email: string): boolean {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      return emailPattern.test(email);
  }

  function validateUserInput(user: User) {
    const newErrors: any = {};

    if (!user.name?.trim()) {
        newErrors.name = 'Name cannot be empty.';
    }

    if (!user.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number cannot be empty.';
    } else if (!validatePhone(user.phoneNumber)) {
      newErrors.phoneNumber =  'Phone pattern is not valid.';
    }

    if (!user.email?.trim()) {
        newErrors.email =  'Email cannot be empty.';
    } else if (!emailPattern(user.email)) {
      newErrors.email = 'Email pattern is not valid.';
    }

    // Validate password
    if (!user.password?.trim()) {
        newErrors.password = 'Password cannot be empty.';
    } else if (user.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(user.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(user.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(user.password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/[!@#\$%\^&\*]/.test(user.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).';
    }

    return newErrors;
}

  return (
    <>
      {updatedUser  && (
      <form onSubmit={handleSubmit}>
        <div>
          <h1>Profile Details</h1>
          <h2>User Details</h2>
            <section className={styles.userDetails}>
              <table>
                <tbody>
                  <tr>
                    <td>{t("userDetails.name")}:</td>
                    <td>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={updatedUser.name || ''}
                        onChange={(e) => handleUserInputChange("name", e.target.value)}
                        onClick={() => handleUserInputChange("name", '')}
                        onBlur={() => {if (updatedUser.name === '') handleUserInputChange("name", user.name)}} 
                      />
                      {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </td>
                  </tr>
                  <tr>
                    <td>{t("userDetails.phoneNumber")}:</td>
                    <td>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={updatedUser.phoneNumber || ''}
                        onChange={(e) => handleUserInputChange("phoneNumber", e.target.value)}
                        onClick={() => handleUserInputChange("phoneNumber", '')}
                        onBlur={() => {if (updatedUser.phoneNumber === '') handleUserInputChange("phoneNumber", user.phoneNumber)}}
                      />
                      {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
                    </td>
                  </tr>
                  <tr>
                    <td>E-mail:</td>
                    <td>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={updatedUser.email || ''}
                        onChange={(e) => handleUserInputChange("email", e.target.value)}
                        onClick={() => handleUserInputChange("email", '')}
                        onBlur={() => {if (updatedUser.email === '') handleUserInputChange("email", user.email)}}
                      />
                      {errors.email && <p className={styles.error}>{errors.email}</p>}
                    </td>
                  </tr>
                  <tr>
                    <td>{t("userDetails.nationalRegisterNumber")}:</td>
                    <td>{updatedUser.nationalRegisterNumber}</td>
                  </tr>
                  <tr>
                    <td>{t("userDetails.birthDate")}:</td>
                    <td>{updatedUser.birthDate ? new Date(updatedUser.birthDate).toISOString().split('T')[0] : ''}</td>
                  </tr>
                  <tr>
                  <td>Password:</td>
                    <td>
                      <input
                        type={type}
                        id="password"
                        name="password"
                        value={updatedUser.password || ''}
                        onChange={(e) => handleUserInputChange("password", e.target.value)}
                        onClick={() => handleUserInputChange("password", '')}
                        onBlur={() => { if (updatedUser.password === '') handleUserInputChange("password", user.password)}}
                      />
                      {errors.password && <p className={styles.error}>{errors.password}</p>}
                      <input type="checkbox" onClick={togglePassword}/>
                    </td>
                  </tr>
                </tbody>
              </table>
          </section>
          <section className={styles.accountOverview}>
          <h2>Account details</h2>
          <table>
          <thead>
          <tr>
            <th>{t("accountOverview.accountNumber")}</th>
            <th>{t("accountOverview.balance")}</th>
            <th>Status</th>
            <th>{t("accountOverview.deleteAccount")}</th>
          </tr>
          </thead>
              <tbody>
                {updatedAccounts && updatedAccounts.length > 0 ? (
                  updatedAccounts.map((account, index) => (
                    <tr key={account.id} onClick={() => {handleAccountSelection(account)
                      console.log(updatedAccountStatus)}}>
                      <td>{account.accountNumber}</td>
                      <td>{account.balance}</td>
                      <td> 
                        <label htmlFor="status">Change current status ({accounts.map((account) => account.status)[index]}): </label>

                        <select
                          name="status"
                          id="status"
                          value={account.status}
                          onChange={(e) => handleAccountInputChange("status", e.target.value)}
                          >
                          <option value="Active">Active</option>
                          <option value="Blocked">Blocked</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td><button onClick={(e) => account.accountNumber && handleDeleteAccount(account.accountNumber, e)}>Delete Account</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>{t("accountOverview.noAccounts")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          <button type="submit" onSubmit={handleSubmit}>Save Changes</button>
        </div>
      </form>
      )}
    </>
  );
};

export default Settings;
