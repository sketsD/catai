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
  userid: null,
  token: Cookies.get("auth-token") || null,
  status: "idle",
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk<
  { id: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ id, password }, { rejectWithValue }) => {
  try {
    const response = await authService.login({ id, password });
    console.log(response.data.access_token);
    Cookies.set("auth-token", response.data.access_token, {
      expires: 7,
      secure: true,
    });
    return { id };
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userid = null;
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userid = action.payload.id;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
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
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
