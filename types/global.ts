import { string } from "zod";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
  // другие поля, которые может вернуть API
}

export interface LoginResponse {
  access_token: string;
  // другие поля, которые может вернуть API
}

export interface User {
  id: string;
  firstname: string;
  surname: string;
  role: "admin" | "tech" | "pharm";
  email: string;
  created_at: string;
  updated_at: string;
}

export interface State {
  status: "idle" | "success" | "error";
  loading: boolean;
  error: string | null;
}

export interface AuthState extends State {
  userid: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  id: string;
  password: string;
}

export interface RegisterSliceCredentials extends LoginCredentials {
  firstname: string;
  surname: string;
  email: string;
  role: "admin" | "tech" | "pharm";
}

export interface RegisterCredentials extends RegisterSliceCredentials {
  created_at: string;
  updated_at: string;
}

export interface UserState extends State {
  users: Array<User>;
  currentUser: UserNoPass | null;
}

export interface UserNoPass {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  role: "admin" | "tech" | "pharm";
}

export interface Medicine {
  metadata_id: string | null;
  product_name: string | null;
  product_dosage: string | null;
  intake_method: string | null;
  category: string | null;
  manufacturer: string | null;
  type_packaging: string | null;
  product_name_generic: string | null;
  product_active_ingredient: string | null;
  manufacturing_country: string | null;
  country_registration: string | null;
  status: "pending" | "decilne" | "approved" | null;
}

export interface MedicineState extends State {
  medicines: Array<Medicine> | [];
}
