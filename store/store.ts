import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import medicineReducer from "./slices/medicineSlice";
import { setupApiInterceptors } from "@/utils/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    medicine: medicineReducer,
  },
});

setupApiInterceptors(() => store.dispatch(logout()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
