"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, users, getToken, setToken, removeToken, User } from "./client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refreshUser(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (token) {
        const currentUser = await users.me();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      // If token is invalid, remove it
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await auth.login({ email, password });

      // Save token to localStorage
      setToken(response.access_token);

      // Fetch and set user data
      const currentUser = await users.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call backend logout endpoint
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of backend response
      removeToken();
      setUser(null);

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await users.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, user might be logged out
      removeToken();
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
