import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginToken } from "../api/authApi";
import { getAccounts } from "../api/configApi";
import { queryKeys } from "../api/queryKeys";
import { queryClient } from "../lib/queryClient";
import {
  clearAuthStorage,
  getAccessToken,
  getUsername,
  setAccessToken,
  setUsername,
} from "../utils/authStorage";
import { hasSuperuserBypass } from "../utils/superuserBypass";

const AuthContext = createContext(null);

const prefetchAccountConfig = () =>
  queryClient.fetchQuery({
    queryKey: queryKeys.configAccounts(),
    queryFn: getAccounts,
  });

const prefetchAccountConfigSafely = () =>
  prefetchAccountConfig().catch(() => undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAccessToken());
  const [username, setUsernameState] = useState(() => getUsername());

  useEffect(() => {
    if (token && username && !hasSuperuserBypass(username)) {
      prefetchAccountConfigSafely();
    }
  }, [token, username]);

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

    if (!hasSuperuserBypass(resolvedUsername)) {
      await prefetchAccountConfigSafely();
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUsernameState(null);
    queryClient.removeQueries({ queryKey: queryKeys.configAccounts() });
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
