import api from "./api";

export const AuthService = {
  login: async (email: string, password: string) => {
    const queryUser = await api.get(`/users`, {
      // Send email through param: /users&email=...
      params: { email: email },
    });

    // Json-server return the result as an array -> If there's 1 user fit, it always returns result as an array
    const user = queryUser.data[0];

    if (!user) {
      throw new Error("This email is not registered!");
    }

    if (password !== user.password) {
      throw new Error("The password is not correct!");
    }

    return user;
  },
};
