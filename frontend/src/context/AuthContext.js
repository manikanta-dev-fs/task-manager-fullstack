"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const response = await api.get("/api/auth/me");
    setUser(response.data.data || null);
    return response.data.data || null;
  }, []);

  const login = useCallback(async (payload) => {
    await api.post("/api/auth/login", payload);
    return fetchMe();
  }, [fetchMe]);

  const register = useCallback(async (payload) => {
    await api.post("/api/auth/register", payload);
    return fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const response = await api.get("/api/auth/me");
        if (mounted) {
          setUser(response.data.data || null);
          setError("");
        }
      } catch (err) {
        if (!mounted) return;

        if (err.response?.status === 401) {
          setUser(null);
          setError("");
        } else {
          setError(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      fetchMe,
      setUser,
      error,
    }),
    [user, isLoading, login, register, logout, fetchMe, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
