import { Authentication, User } from "@/types";

const createUser = async (user: User): Promise<void> => {
  await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).catch((error) => {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  });
};

const getUserByEmailAndPassword = async (
  credentials: Authentication
): Promise<User> => {
  console.log("Request payload:", JSON.stringify(credentials));
  if (!credentials.email || !credentials.password) {
    throw new Error(
      "Credentials object is missing required fields: email and password"
    );
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/users/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const user = await response.json();

  // Verify the user object has the required properties
  if (!user || !user.email) {
    throw new Error("User data is invalid or missing an email");
  }

  return user;
};

const getUserByNationalRegisterNumber = async (
  userNationalRegisterNumber: string
): Promise<User> => {
  try {
    const token = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    )?.token;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userNationalRegisterNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user by national register number ${userNationalRegisterNumber}`
      );
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user by national register number:", error);
    throw error;
  }
};

const loginUser = async (credentials: Authentication) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/users/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const userData = await response.json();
  return userData;
};

const updateUser = async (nationalRegisterNumber: string, user: User): Promise<User> => {
  try {
    const token = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    )?.token;
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${nationalRegisterNumber}/settings`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      }
    ); 

    // const updatedUserr = await response.text();
    // console.log(updatedUserr);

    if (!response.ok) {
      throw new Error("User not updated");
    }

    const updatedUser = await response.json();
    return updatedUser;

  } catch (error: any) {
    throw new Error(error);
  }
};

const UserService = {
  createUser,
  getUserByEmailAndPassword,
  getUserByNationalRegisterNumber,
  loginUser,
  updateUser
};

export default UserService;
