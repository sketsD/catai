import { UserNoPass, RegisterCredentials } from "@/types/global";
import { api } from "./api";

type TokenId = {
  token: string;
  id: string;
};

export const userService = {
  getUsers: (token: string) =>
    api.get<Array<RegisterCredentials>>(`/users?jwt_token=${token}`),
  getCurrentUser: ({ token, id }: TokenId) =>
    api.get<UserNoPass>(`/users/${id}?jwt_token=${token}`),
  //   Path to be changed
  deleteCurrentUser: ({ token, id }: TokenId) =>
    api.delete(`/users/${id}?jwt_token=${token}`),
  updateCurrentUser: ({ token, id }: TokenId, credentials: UserNoPass) =>
    api.put(`/users/${id}?jwt_token=${token}`, credentials),
};

// /users/sdsdsd?jwt_token=sddsds'
