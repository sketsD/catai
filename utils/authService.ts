import { api } from "./api";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/global";

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<{ access_token: string /* user: User*/ }>("/login", credentials),
  registerNewUser: (credentials: RegisterCredentials, token: string) =>
    api.post<{ message: string }>(`/register?jwt_token=${token}`, credentials),

  //   forgotPassword: (email: string) =>api.post<{ message: string }>("/forgot-password", { email }),
  //   resetPassword: (token: string, newPassword: string) =>api.post<{ message: string }>("/reset-password", { token, newPassword }),
  //   getCurrentUser: () => api.get<User>("/user"),
  //   updateUserProfile: (userData: Partial<User>) =>api.put<User>("/user", userData),
  //   deleteUser: () => api.delete<{ message: string }>("/user"),
};
