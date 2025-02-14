"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import type React from "react";
import { checkAuth } from "@/store/slices/authSlice";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, token } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
        setIsInitialCheck(false);
      } catch (error) {
        if (!isAuthenticated && !token) {
          router.replace("/");
        }
        setIsInitialCheck(false);
      }
    };

    if (isInitialCheck) {
      checkAuthentication();
    }

    if (!isInitialCheck && !token) {
      checkAuthentication();
    }
  }, [dispatch, router, isAuthenticated, token, isInitialCheck]);

  if (isInitialCheck || loading) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
}
