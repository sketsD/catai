"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

// Test credentials
const TEST_CREDENTIALS = {
  idNumber: "123456789",
  password: "test123",
};

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  type: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    idNumber: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (idNumber: string, password: string) => {
    if (
      idNumber === TEST_CREDENTIALS.idNumber &&
      password === TEST_CREDENTIALS.password
    ) {
      setUser({
        id: TEST_CREDENTIALS.idNumber,
        name: "Serge",
        surname: "Stone",
        email: "stone@mail.com",
        type: "Admin",
      });
      // Set a cookie to persist the login state
      document.cookie = "auth-token=logged-in; path=/; max-age=3600";
      router.push("/dashboard");
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid ID Number or password",
    };
  };

  const logout = async () => {
    setUser(null);
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
