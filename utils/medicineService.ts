import { Medicine } from "@/types/global";
import { api } from "./api";

type TokenId = {
  token: string;
  id: string;
};

export const medicineService = {
  getAllMedicine: (token: string) =>
    api.get<Array<Medicine>>(`/medicines?jwt_token=${token}`),
  //   getCurrentUser: ({ token, id }: TokenId) =>
  //     api.get<UserNoPass>(`/users?id=${id}&jwt_token=${token}`),
  //   //   Path to be changed
  //   deleteCurrentUser: ({ token, id }: TokenId) =>
  //     api.delete(`/users/${id}?jwt_token=${token}`),
  //   updateCurrentUser: ({ token, id }: TokenId, credentials: UserNoPass) =>
  //     api.put(`/users/${id}?jwt_token=${token}`, credentials),
};

// /users/sdsdsd?jwt_token=sddsds'
