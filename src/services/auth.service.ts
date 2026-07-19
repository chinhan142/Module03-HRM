import { string } from "yup";
import type { User } from "../types/user.interface";
import { createFakeJwt, parseFakeJwt } from "../utils/jwt.util";
import api from "./api";

// Promise to return the user if existed and the token assign to that user used for login
export const AuthService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> => {
    const response = await api.get<User[]>(`/users`, {
      // Send email through param: /users&email=...
      params: { email: email },
    });

    // Json-server return the result as an array -> If there's 1 user fit, it always returns result as an array
    const user = response.data[0];

    if (!user) {
      throw new Error("This email is not registered!");
    }

    if (password !== user.password) {
      throw new Error("The password is not correct!");
    }

    const token = await createFakeJwt(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      "chinhan",
    );

    localStorage.setItem("access_token", token);

    return { user, token };
  },

  getProfileFromToken: async (): Promise<User | null> => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = await parseFakeJwt<{ userId: string }>(token, "chinhan");
      const response = await api.get<User>(`/users/${payload.userId}`);
      return response.data;
    } catch (error) {
      console.log("Token is not valid!", error);
      localStorage.removeItem("access_token");
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
  },
};
