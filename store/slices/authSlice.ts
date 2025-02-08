import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "@/utils/api";
import type {
  AuthState,
  User,
  LoginCredentials,
  RegisterSliceCredentials,
} from "@/types/global";
import { authService } from "@/utils/authService";

// Начальное состояние без данных из localStorage
const initialState: AuthState = {
  userid: null,
  token: null,
  status: "idle",
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Функция для инициализации стейта на клиенте
export const initializeAuthState = () => {
  if (typeof window === 'undefined') return initialState;
  
  const token = localStorage.getItem('auth-token');
  const userid = localStorage.getItem('user-id');
  
  return {
    ...initialState,
    token,
    userid,
    isAuthenticated: !!token
  };
};

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    if (typeof window === 'undefined') return rejectWithValue('Not in browser');
    
    const token = localStorage.getItem('auth-token');
    const userid = localStorage.getItem('user-id');
    
    if (!token || !userid) {
      return rejectWithValue('No auth data');
    }
    return { token, userid };
  }
);

export const loginUser = createAsyncThunk<
  { id: string; token: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ id, password }, { rejectWithValue }) => {
  try {
    const response = await authService.login({ id, password });
    const token = response.data.access_token;
    
    console.log('auth-token', token);
    console.log('user-id', id);
    localStorage.setItem('auth-token', token);
    localStorage.setItem('user-id', id);
    
    return { id, token };
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
    const token = localStorage.getItem('auth-token');
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-id');
      }
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
    // Добавляем редюсер для инициализации стейта на клиенте
    initializeFromStorage: (state) => {
      const newState = initializeAuthState();
      state.token = newState.token;
      state.userid = newState.userid;
      state.isAuthenticated = newState.isAuthenticated;
    }
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
        state.token = action.payload.token;
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
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userid = action.payload.userid;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null;
        state.userid = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, initializeFromStorage } = authSlice.actions;
export default authSlice.reducer;
