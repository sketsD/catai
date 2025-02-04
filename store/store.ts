import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import medicineReducer from "./slices/medicineSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    medicine: medicineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
