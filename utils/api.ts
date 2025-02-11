import { ApiError } from "@/types/global";
import axios, { type AxiosError } from "axios";
import { removeLocalStorage } from "./localStorage";
import { initializeAuthState } from "@/store/slices/authSlice";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
      removeLocalStorage("auth-token");
      removeLocalStorage("user-id");
      // initializeAuthState();

      return Promise.reject(apiError);
    }
  }
);
