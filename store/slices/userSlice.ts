import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User, UserNoPass, UserState } from "@/types/global";
import { userService } from "@/utils/userServie";
import { getLocalStorage } from "@/utils/localStorage";
import { RootState } from "../store";
import { FilterStateUsers } from "@/components/filter-select";

const token = getLocalStorage("auth-token");
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
    const token = getLocalStorage("auth-token");
    if (!token) throw new Error("Token is not provided");
    const response = await userService.getUsers(token);
    console.log("[USER getAllUsers] response: ", response);
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
    console.log("[USER getCurrentUser] response: ", response);
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

export const selectFilteredUsers = (
  state: RootState,
  filters: FilterStateUsers,
  searchQuery: string = "",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const filtered = state.user.users.filter((user) => {
    // Search
    const searchQueryLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? user.firstname?.toLowerCase().includes(searchQueryLower) ||
        user.surname?.toLowerCase().includes(searchQueryLower) ||
        user.id?.toLowerCase().includes(searchQueryLower)
      : true;

    // Filter by the category
    const matchesGroup = !filters.all ? filters[user.role] && user.role : true;

    return matchesSearch && matchesGroup;
  });
  // Sorting by Ascending / Descending
  return [...filtered].sort((a, b) => {
    if (sortOrder === "asc") return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });
};

// const filteredAndSortedEmployees = useMemo(() => {
//   return users
//     .filter((user) => {
//       const matchesSearch =
//         user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.role.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesType =
//         filters.all ||
//         filters[user.role.toLowerCase() as keyof typeof filters];
//       return matchesSearch && matchesType;
//     })
//     .sort((a, b) => {
//       if (sortOrder === "asc") {
//         return a.id.localeCompare(b.id);
//       } else {
//         return b.id.localeCompare(a.id);
//       }
//     });
// }, [
//   searchQuery,
//   filters,
//   sortOrder,
//   dispatch,
//   getAllUsers,
//   clearError,
//   // status,
//   loading,
// ]);
