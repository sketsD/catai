import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User, UserNoPass, UserState } from "@/types/global";
import { userService } from "@/utils/userServie";

const token = localStorage.getItem("auth-token");
const initialState: UserState = {
  status: "idle",
  loading: false,
  error: null,
  currentUser: null,
  users: [],
  isEvent: false,
};

export const getAllUsers = createAsyncThunk<
  Array<User>,
  void,
  { rejectValue: string }
>("user/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("Token is not provided");
    const response = await userService.getUsers(token);
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Registration failed");
  }
});

export const getCurrentUser = createAsyncThunk<
  UserNoPass,
  { id: string },
  { rejectValue: string }
>("user/getCurrentUser", async (id, { rejectWithValue }) => {
  try {
    if (!token) throw new Error("Token is not provided");
    const response = await userService.getCurrentUser({ ...id, token });
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
    const response = await userService.deleteCurrentUser({ ...id, token });
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to load user data");
  }
});

export const updateCurrentUser = createAsyncThunk<
  UserNoPass,
  UserNoPass,
  { rejectValue: string }
>(
  "user/updateCurrentUser",
  async ({ id, firstname, surname, email, role }, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("Token is not provided");
      const response = await userService.updateCurrentUser(
        { id, token },
        { id, firstname, surname, email, role }
      );
      console.log(response);
      return { id, firstname, surname, email, role };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update user data");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
      console.log(state.status + " clearing status");
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.status = "idle";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
        // state.status = "success";
        console.log(state.status + " all fulfiled");
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Loading failed";
        // state.status = "error";
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUser = null;
        // state.status = "idle";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
        // state.status = "success";
        console.log(state.status + " current fulfiled");
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload || "Loading of user is failed";
        // state.status = "error";
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.isEvent = true;
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isEvent = false;
        state.error = null;
        state.currentUser = action.payload;
        state.status = "success";
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isEvent = false;
        state.error = action.payload || "Updating of user is failed";
        state.status = "error";
      })
      .addCase(deleteCurrentUser.pending, (state) => {
        state.isEvent = true;
        state.loading = true;
        state.error = null;
        // state.status = "idle";
      })
      .addCase(deleteCurrentUser.fulfilled, (state) => {
        state.loading = false;
        state.isEvent = false;
        state.error = null;
        state.currentUser = null;
        // state.status = "success";
      })
      .addCase(deleteCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isEvent = false;
        state.error = action.payload || "Deleting of user is failed";
        // state.status = "error";
      });
  },
});

export const { clearError, clearUser } = userSlice.actions;
export default userSlice.reducer;
