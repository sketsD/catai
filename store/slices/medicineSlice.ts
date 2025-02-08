import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Medicine, MedicineState } from "@/types/global";
import Cookies from "js-cookie";
import { userService } from "@/utils/userServie";
import { medicineService } from "@/utils/medicineService";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import { FilterState } from "@/components/filter-dialog";

const sortMedicine = (data: Array<Medicine>, sortedBy: "new" | "old") => {
  return data.sort((a: Medicine, b: Medicine) => {
    if ("new" === sortedBy) {
      // console.log("New sorted");
      return compareDesc(parseISO(a.created_at), parseISO(b.created_at));
    }
    return compareAsc(parseISO(a.created_at), parseISO(b.created_at));
  });
};

const token = Cookies.get("auth-token");
const initialState: MedicineState = {
  status: "idle",
  loading: false,
  error: null,
  currentMedicine: null,
  medicines: [],
};

export const getMedicineByStatus = createAsyncThunk<
  Array<Medicine>,
  string,
  { rejectValue: string }
>("medicine/getMedicineByStatus", async (status, { rejectWithValue }) => {
  try {
    const token = Cookies.get("auth-token");
    if (!token) throw new Error("Token is not provided");
    const response = await medicineService.getMedicineByStatus({
      token,
      status,
    });
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
    getMedicineData: (state, action: PayloadAction<{ id: string }>) => {
      state.loading = true;
      const medicineResult = state.medicines.filter(
        (medicine) => medicine.metadata_id === action.payload.id
      );
      if (medicineResult.length === 1) {
        console.log(medicineResult);
        state.currentMedicine = medicineResult as [Medicine];
        state.error = null;
        state.loading = false;
      } else {
        state.error = "Medicine not found";
        state.currentMedicine = null;
        state.loading = false;
      }
    },

    getSorted: (state, action: PayloadAction<{ sortedBy: "new" | "old" }>) => {
      if (state.medicines.length === 0) {
        state.error = "Medicine not found. Can't sort";
        state.medicines = [];
      } else if (state.medicines.length === 1) {
        state.medicines = state.medicines;
      } else {
        const medicineSortedResult = sortMedicine(
          state.medicines,
          action.payload.sortedBy
        );
        state.medicines = medicineSortedResult;
        state.error = null;
      }
    },
    getFiltered: (state, action: PayloadAction<FilterState>) => {
      console.log("twice");
      state.medicines = state.medicines.filter((medicine) => {
        return (
          action.payload.groupType.all ||
          (action.payload.groupType.technical &&
            medicine.category === "tech") ||
          (action.payload.groupType.pharmacy && medicine.category === "pharm")
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMedicineByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getMedicineByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = sortMedicine(action.payload, "new");
        console.log("once");
        state.error = null;
        state.status = "success";
      })
      .addCase(getMedicineByStatus.rejected, (state, action) => {
        state.loading = false;
        state.medicines = [];
        state.error = action.payload || "Loading failed";
        state.status = "error";
      });
  },
});

export const { clearError, getMedicineData, getSorted, getFiltered } =
  medicineSlice.actions;
export default medicineSlice.reducer;

// Filter and sort medicines
// const filteredMedicines = medicines.filter((medicine) => {
//   const matchesSearch = medicine.product_name
//     .toLowerCase()
//     .includes(searchQuery.toLowerCase());

//   // Apply group type filter
// const matchesGroupType =
//   filters.groupType.all ||
//   (filters.groupType.technical && medicine.category === "technical") ||
//   (filters.groupType.pharmacy && medicine.category === "pharmacy");

//   // Apply date filter (simplified for demo)
//   // const matchesDate = filters.date.oneDay
//   //   ? medicine.date >= "20/10/24"
//   //   : medicine.date < "20/10/24";

//   return matchesSearch && matchesGroupType;
//   // return matchesSearch && matchesGroupType && matchesDate;
// });
// .sort((a, b) => {
//   if (sortOrder === "new") {
//     return b.date.localeCompare(a.date);
//   }
//   return a.date.localeCompare(b.date);
// });
