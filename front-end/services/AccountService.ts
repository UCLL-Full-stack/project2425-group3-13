import { Account } from "@/types";
import { error } from "console";

const getAccountsForUser = async (): Promise<Account[]> => {
  try {
    const token = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    )?.token;
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/account", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("failed loading accounts.");
    }

    const accounts = await response.json();
    return accounts;
  } catch (error: any) {
    throw error;
  }
};
const getAccountById = async (id: number): Promise<Account> => {
  const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.token;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/account/" + id,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch account");
  }

  return response.json();
};

const getAccountByAccountNumber = async (
  accountNumber: string
): Promise<Account> => {
  const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.token;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/account/accountNumber/" + accountNumber,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch account");
  }

  return response.json();
};

const updateAccount = async (account: Account): Promise<Account> => {
  try {
    const token = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    )?.token;
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/account`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(account),
    });

    // const updatedAccountt = await response.json();
    // console.log(updatedAccountt);

    if (!response.ok) {
      throw new Error("Account not updated!");
    }

    const updatedAccount = await response.json();
    return updatedAccount;
  } catch (error: any) {
    throw new Error(error);
  }
};

const deleteAccount = async (accountNumber: string): Promise<void> => {
  const token = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.token;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/account/" + accountNumber,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
};

const AccountService = {
  getAccountsForUser,
  getAccountById,
  getAccountByAccountNumber,
  updateAccount,
  deleteAccount,
};

export default AccountService;
