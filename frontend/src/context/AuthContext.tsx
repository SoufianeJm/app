"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthResponse, authApi, User } from "@/lib/api";
import Cookies from "js-cookie";

interface AuthContextType {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isMounted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const token = Cookies.get("token");
    if (token) {
      authApi.getUserInfo().then((userInfo) => {
        // Convert User to AuthResponse format
        setUser({
          token: token,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: userInfo.role
        });
        setIsLoading(false);
      }).catch(() => {
        Cookies.remove("token");
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [isMounted]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    Cookies.set("token", response.token);
    setUser(response);
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isMounted }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

