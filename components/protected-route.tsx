"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCurrentUser } from "../store/slices/authSlice";
import type React from "react"; // Added import for React

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, token } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated && !loading) {
  //     dispatch(fetchCurrentUser());
  //   }
  // }, [isAuthenticated, loading, dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, token, loading, router]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return isAuthenticated ? <>{children}</> : null;
}
