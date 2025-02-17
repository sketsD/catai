import { ApiError } from "@/types/global";
import axios, { type AxiosError } from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//   (response) => response,
// (error: AxiosError) => {
//   console.log("[API] Error : " + error);
//   const apiError: ApiError = {
//     message: error.response?.data?.detail || "An unexpected error occurred",
//     status: error.response?.status,
//     code: error.code,
//   };
//   if (error.response && error.response.status === 401) {
//     console.log("[API] Unauthorized Response: " + error.response);
//     console.log("[API] Unauthorized Status: " + error.status);
//     }
//     return Promise.reject(apiError);
//   }
// );
export const setupApiInterceptors = (logout: () => void) => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.log("[API] Error : " + error);
      const apiError: ApiError = {
        message: error.response?.data?.detail || "An unexpected error occurred",
        status: error.response?.status,
        code: error.code,
      };

      if (error.response && error.response.status === 401) {
        console.log("[API] Unauthorized Response: " + error.response);
        console.log("[API] Unauthorized Status: " + error.status);
        logout();
      }
      return Promise.reject(apiError);
    }
  );
};
