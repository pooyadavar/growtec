import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { loginToken } from "../api/authApi";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAccessToken());

  const login = useCallback(async (username, password) => {
    const response = await loginToken(username, password);
    const accessToken = response?.access ?? response?.token;

    if (!accessToken) {
      throw new Error("توکن دریافت نشد.");
    }

    setAccessToken(accessToken);
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
