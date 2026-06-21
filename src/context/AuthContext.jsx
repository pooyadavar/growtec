import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { loginToken } from "../api/authApi";
import {
  clearAuthStorage,
  getAccessToken,
  getUsername,
  setAccessToken,
  setUsername,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAccessToken());
  const [username, setUsernameState] = useState(() => getUsername());

  const login = useCallback(async (usernameInput, password) => {
    const response = await loginToken(usernameInput, password);
    const accessToken = response?.access ?? response?.token;

    if (!accessToken) {
      throw new Error("توکن دریافت نشد.");
    }

    const resolvedUsername = usernameInput.trim();
    setAccessToken(accessToken);
    setUsername(resolvedUsername);
    setToken(accessToken);
    setUsernameState(resolvedUsername);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUsernameState(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      username,
      login,
      logout,
    }),
    [token, username, login, logout],
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
