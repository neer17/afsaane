import { API_ENDPOINTS } from "@/utils/constants";
import { UserCreationData } from "@/types/user.types";

export const UserService = {
  createUser: async (userData: UserCreationData): Promise<Response> => {
    // if (!phoneNumber) return Promise.reject();

    // Validate input parameters
    // if (!phoneNumber || phoneNumber.trim().length !== 10) {
    //   throw new Error("Phone number should be 10 digits long");
    // }

    const CREATE_USER_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.USER_CREATE.URL}`;
    const response = await fetch(CREATE_USER_ENDPOINT, {
      method: API_ENDPOINTS.USER_CREATE.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    return response;
  },
  signIn: async (userCredentials: {
    phone?: string;
    googleAuthId?: string;
  }): Promise<Response> => {
    const SIGNIN_USER_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.USER_SIGNIN.URL}`;
    const response = await fetch(SIGNIN_USER_ENDPOINT, {
      method: API_ENDPOINTS.USER_SIGNIN.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userCredentials),
    });

    return response;
  },
};
