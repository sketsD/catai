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
    api.get<UserNoPass>(`/users?id=${id}&jwt_token=${token}`),
  //   Path to be changed
  deleteCurrentUser: ({ token, id }: TokenId) =>
    api.delete(`/users/${id}?jwt_token=${token}`),
};
