import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Medicine, MedicineState } from "@/types/global";
import { medicineService } from "@/utils/medicineService";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import { FilterState } from "@/components/filter-dialog";
import { RootState } from "../store";
import { getLocalStorage } from '@/utils/localStorage';

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
    console.log("[Redux] Starting getMedicineByStatus thunk with status:", status);
    const token = getLocalStorage("auth-token");
    if (!token) {
      console.error("[Redux] Token is not provided in getMedicineByStatus");
      throw new Error("Token is not provided");
    }
    const response = await medicineService.getMedicineByStatus({
      token,
      status,
    });
    console.log("[Redux] getMedicineByStatus response:", response);
    return response.data;
  } catch (error: any) {
    console.error("[Redux] getMedicineByStatus error:", error);
    return rejectWithValue(error?.message || "Can not load medicine list");
  }
});

export const getMedicineByName = createAsyncThunk<
  Medicine,
  string,
  { rejectValue: string }
>("medicine/getMedicineByName", async (name, { rejectWithValue }) => {
  try {
    console.log("[Redux] Starting getMedicineByName thunk with name:", name);
    const token = getLocalStorage("auth-token");
    if (!token) {
      console.error("[Redux] Token is not provided in getMedicineByName");
      throw new Error("Token is not provided");
    }
    const response = await medicineService.getMedicineByName({
      token,
      name,
    });
    console.log("[Redux] getMedicineByName response:", response);
    return response.data;
  } catch (error: any) {
    console.error("[Redux] getMedicineByName error:", error);
    return rejectWithValue(error?.message || "Can not load medicine details");
  }
});

export const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {
    clearError: (state) => {
      console.log("[Redux] Clearing error state");
      state.error = null;
      state.status = "idle";
    },
    getMedicineData: (state, action: PayloadAction<{ id: string }>) => {
      console.log("[Redux] Getting medicine data for id:", action.payload.id);
      state.loading = true;
      const medicineResult = state.medicines.filter(
        (medicine) => medicine.metadata_id === action.payload.id
      );
      if (medicineResult.length === 1) {
        console.log("[Redux] Found medicine in state:", medicineResult);
        state.currentMedicine = medicineResult as [Medicine];
        state.error = null;
        state.loading = false;
      } else {
        console.error("[Redux] Medicine not found in state");
        state.error = "Medicine not found";
        state.currentMedicine = null;
        state.loading = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMedicineByStatus.pending, (state) => {
        console.log("[Redux] getMedicineByStatus.pending");
        state.loading = true;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getMedicineByStatus.fulfilled, (state, action) => {
        console.log("[Redux] getMedicineByStatus.fulfilled with medicines:", action.payload.length);
        state.loading = false;
        state.medicines = action.payload;
        state.error = null;
        state.status = "success";
      })
      .addCase(getMedicineByStatus.rejected, (state, action) => {
        console.error("[Redux] getMedicineByStatus.rejected with error:", action.payload);
        state.loading = false;
        state.medicines = [];
        state.error = action.payload || "Loading failed";
        state.status = "error";
      })
      .addCase(getMedicineByName.pending, (state) => {
        console.log("[Redux] getMedicineByName.pending");
        state.loading = true;
        state.error = null;
        state.currentMedicine = null;
      })
      .addCase(getMedicineByName.fulfilled, (state, action) => {
        console.log("[Redux] getMedicineByName.fulfilled with medicine:", action.payload);
        state.loading = false;
        state.currentMedicine = [action.payload];
        state.error = null;
      })
      .addCase(getMedicineByName.rejected, (state, action) => {
        console.error("[Redux] getMedicineByName.rejected with error:", action.payload);
        state.loading = false;
        state.currentMedicine = null;
        state.error = action.payload || "Failed to load medicine details";
      });
  },
});

// Селектор для получения уникальных категорий
export const selectUniqueCategories = (state: RootState) => {
  // Сначала собираем все уникальные категории, которые есть у медикаментов
  const categoriesWithMedicines = state.medicine.medicines.reduce((acc, medicine) => {
    if (medicine.category && medicine.category !== "") {
      acc.add(medicine.category);
    }
    return acc;
  }, new Set<string>());
  
  const sortedCategories = Array.from(categoriesWithMedicines).sort();
  
  // Добавляем "No Category" только если есть медикаменты без категории
  if (state.medicine.medicines.some(medicine => !medicine.category || medicine.category === "")) {
    sortedCategories.push("No Category");
  }
  
  return sortedCategories;
};

// Селектор для фильтрации и поиска
export const selectFilteredMedicines = (
  state: RootState,
  filters: FilterState,
  searchQuery: string = "",
  sortOrder: "new" | "old" = "new"
) => {
  const filtered = state.medicine.medicines.filter((medicine) => {
    // Поиск
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? medicine.product_name?.toLowerCase().includes(searchLower) ||
        medicine.metadata_id?.toLowerCase().includes(searchLower) ||
        medicine.category?.toLowerCase().includes(searchLower) ||
        medicine.manufacturer?.toLowerCase().includes(searchLower)
      : true;

    // Фильтр по группе
    const matchesGroup = filters.groupType.all
      ? true
      : filters.groupType["No Category"]
      ? !medicine.category || medicine.category === ""
      : medicine.category && filters.groupType[medicine.category];

    // Фильтр по дате
    let matchesDate = true;
    if (filters.date.oneDay || filters.date.threeWeeks) {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
      const medicineDate = parseISO(medicine.created_at);

      if (filters.date.oneDay) {
        matchesDate = medicineDate >= oneDayAgo;
      } else {
        matchesDate = medicineDate >= threeWeeksAgo;
      }
    }

    return matchesSearch && matchesGroup && matchesDate;
  });

  // Сортировка
  return [...filtered].sort((a, b) => {
    if (sortOrder === "new") {
      return compareDesc(parseISO(a.created_at), parseISO(b.created_at));
    }
    return compareAsc(parseISO(a.created_at), parseISO(b.created_at));
  });
};

export const { clearError, getMedicineData } = medicineSlice.actions;
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
