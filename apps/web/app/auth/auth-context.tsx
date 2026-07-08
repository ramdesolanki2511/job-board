"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<{ user: User; token: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    const { user: userData, token: authToken } = data.data;

    setToken(authToken);
    setUser(userData);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    return { user: userData, token: authToken };
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }

    const data = await response.json();
    const { user: userData, token: authToken } = data.data;

    setToken(authToken);
    setUser(userData);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    return { user: userData, token: authToken };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
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
