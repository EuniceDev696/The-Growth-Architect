import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const refreshAdminAuth = async () => {
    try {
      await apiRequest("/admin/me", { auth: "admin" });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    refreshAdminAuth().catch(() => {
      setIsAuthenticated(false);
      setCheckingAuth(false);
    });
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiRequest("/admin/logout", { method: "POST", auth: "admin" });
    } catch {
      // no-op
    } finally {
      setIsAuthenticated(false);
    }
  };

  return <AuthContext.Provider value={{ isAuthenticated, checkingAuth, login, logout, refreshAdminAuth }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
