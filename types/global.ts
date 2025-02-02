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
  token: string | null;
  user: User | null;
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
  currentUser: UserNoPass | "";
}

export interface UserNoPass {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  role: "admin" | "tech" | "pharm";
}
