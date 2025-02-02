import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Medicine, MedicineState } from "@/types/global";
import Cookies from "js-cookie";
import { userService } from "@/utils/userServie";
import { medicineService } from "@/utils/medicineService";

const token = Cookies.get("auth-token");
const initialState: MedicineState = {
  status: "idle",
  loading: false,
  error: null,
  medicines: [],
};

export const getAllMedicine = createAsyncThunk<
  Array<Medicine>,
  void,
  { rejectValue: string }
>("medicine/getAllMedicne", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("auth-token");
    if (!token) throw new Error("Token is not provided");
    const response = await medicineService.getAllMedicine(token);
    console.log(response);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Can not load medicine list");
  }
});

export const medicineSlice = createSlice({
  name: "medicine",
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
      .addCase(getAllMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getAllMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
        state.error = null;
        state.status = "success";
      })
      .addCase(getAllMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Loading failed";
        state.status = "error";
      });
  },
});

export const { clearError } = medicineSlice.actions;
export default medicineSlice.reducer;
