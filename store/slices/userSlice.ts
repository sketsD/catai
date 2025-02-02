import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User, UserState } from "@/types/global";
import Cookies from "js-cookie";
import { userService } from "@/utils/userServie";

const token = Cookies.get("auth-token");
const initialState: UserState = {
  status: "idle",
  loading: false,
  error: null,
  currentUser: "",
  users: [],
};
export const getAllUsers = createAsyncThunk<
  Array<User>,
  void,
  { rejectValue: string }
>("user/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    // const token = Cookies.get("auth-token");
    if (!token) throw new Error("Token is not provided");
    const response = await userService.getUsers(token);
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Registration failed");
  }
});

export const getCurrentUser = createAsyncThunk<
  User,
  { id: string },
  { rejectValue: string }
>("user/getCurrentUser", async (id, { rejectWithValue }) => {
  try {
    if (!token) throw new Error("Token is not provided");
    const response = await userService.deleteCurrentUser({ ...id, token });
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to load user data");
  }
});

export const deleteCurrentUser = createAsyncThunk<
  { message: string },
  { id: string },
  { rejectValue: string }
>("user/deleteCurrentUser", async (id, { rejectWithValue }) => {
  try {
    if (!token) throw new Error("Token is not provided");
    const response = await userService.getCurrentUser({ ...id, token });
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to load user data");
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
        state.status = "success";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Loading failed";
        state.status = "error";
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
        state.status = "success";
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Loading user is failed";
        state.status = "error";
      })
      .addCase(deleteCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(deleteCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentUser = "";
        state.status = "success";
      })
      .addCase(deleteCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Deleting user is failed";
        state.status = "error";
      });

    // Register
    // .addCase(registerUser.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(registerUser.fulfilled, (state) => {
    //   state.loading = false;
    //   state.error = null;
    //   state.status = "success";
    // })
    // .addCase(registerUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.status = "error";
    //   console.log("here rejected");
    //   console.log(action);
    //   state.error = action.payload || "Registration failed";
    // });
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

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
