import { ApiError } from "@/types/global";
import axios, { type AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log(error);
    const apiError: ApiError = {
      message: error.response?.data?.detail || "An unexpected error occurred",
      status: error.response?.status,
      code: error.code,
    };
    return Promise.reject(apiError);
  }
);
// Добавляем перехватчик для добавления токена
// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("auth-token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

