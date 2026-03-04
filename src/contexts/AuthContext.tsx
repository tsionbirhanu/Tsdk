"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, mockUsers } from "@/lib/mock-data";
import FloatingAIAssistant from "../components/FloatingAIAssistant";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: any | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on mount
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") === "true";
    const adminStatus =
      typeof window !== "undefined" &&
      localStorage.getItem("isAdmin") === "true";

    setIsLoggedIn(loggedIn);
    setIsAdmin(adminStatus);

    if (loggedIn) {
      // Get current user (in real app, this would be from JWT token or API)
      const currentUser = adminStatus
        ? mockUsers.find((u) => u.role === "admin")
        : getCurrentUser();
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    // Auth guard logic
    const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/register"];
    const adminRoutes = ["/admin"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith("/admin");

    if (!isLoggedIn && !isPublicRoute) {
      // Redirect to login if not logged in and trying to access protected route
      router.push("/auth/login");
    } else if (isAdminRoute && !isAdmin) {
      // Redirect to regular dashboard if non-admin trying to access admin routes
      router.push("/dashboard");
    }
  }, [isLoggedIn, isAdmin, pathname, router]);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");

    // Mock admin check (in real app, this would come from the JWT token)
    const isAdminUser = Math.random() < 0.3; // 30% chance of being admin for demo
    setIsAdmin(isAdminUser);
    localStorage.setItem("isAdmin", isAdminUser.toString());

    const currentUser = isAdminUser
      ? mockUsers.find((u) => u.role === "admin")
      : getCurrentUser();
    setUser(currentUser);

    router.push(isAdminUser ? "/admin" : "/dashboard");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    router.push("/");
  };

  const isPublicRoute = pathname === "/" || pathname.startsWith("/auth");
  const showFloatingAssistant = isLoggedIn && !isPublicRoute;

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
      {showFloatingAssistant && <FloatingAIAssistant />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
