import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "@/utils/api";
import type {
  AuthState,
  User,
  LoginCredentials,
  RegisterSliceCredentials,
} from "@/types/global";
import Cookies from "js-cookie";
import { authService } from "@/utils/authService";

const initialState: AuthState = {
  token: Cookies.get("auth-token") || null,
  status: "idle",
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ id, password }, { rejectWithValue }) => {
  try {
    const response = await authService.login({ id, password });
    Cookies.set("auth-token", response.data.access_token, {
      expires: 7,
      secure: true,
    });

    // Данные пользователя должны приходить с сервера
    const user: User = {
      id,
      firstname: "John",
      surname: "Doe",
      email: "john@example.com",
      role: "admin",
      created_at: "2727",
      updated_at: "338383",
    };
    return user;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk<
  void,
  RegisterSliceCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const now = new Date().toISOString();
    const token = Cookies.get("auth-token");
    if (!token) throw new Error("Token is not provided");
    await authService.registerNewUser(
      {
        ...credentials,
        created_at: now,
        updated_at: now,
      },
      token
    );
  } catch (error: any) {
    return rejectWithValue(error?.message || "Registration failed");
  }
});

// export const fetchCurrentUser = createAsyncThunk<
//   User,
//   void,
//   { rejectValue: string }
// >("auth/fetchCurrent", async (_, { rejectWithValue }) => {
//   try {
//     const token = Cookies.get("auth-token");
//     if (!token) {
//       throw new Error("No authentication token found");
//     }

//     const user: User = {
//       id: "1",
//       name: "John",
//       surname: "Doe",
//       email: "john@example.com",
//       role: "admin",
//     };
//     return user;
//   } catch (error: any) {
//     return rejectWithValue(error?.message || "Failed to fetch user");
//   }
// });

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove("auth-token");
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.status = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        console.log("here rejected");
        console.log(action);
        state.error = action.payload || "Registration failed";
      });
    // Fetch Current User
    // .addCase(fetchCurrentUser.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.user = action.payload;
    //   state.isAuthenticated = true;
    //   state.error = null;
    // })
    // .addCase(fetchCurrentUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "Failed to fetch user";
    //   state.isAuthenticated = false;
    // });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
