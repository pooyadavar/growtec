import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../api/configApi";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";
import { hasSuperuserBypass } from "../utils/superuserBypass";

const normalizeUsers = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  return [];
};

const resolveIsSuperuser = (data, username) => {
  if (!data || !username) return false;

  const normalizedUsername = username.trim();

  if (
    data.is_superuser !== undefined &&
    data.username?.trim() === normalizedUsername
  ) {
    return data.is_superuser === true;
  }

  const users = normalizeUsers(data);
  const currentUser = users.find(
    (user) => user.username?.trim() === normalizedUsername,
  );
  return currentUser?.is_superuser === true;
};

export const useIsSuperuser = () => {
  const { isAuthenticated, username } = useAuth();
  const bypassSuperuser = isAuthenticated && hasSuperuserBypass(username);

  const { data, isPending, isFetching } = useQuery({
    queryKey: queryKeys.configAccounts(),
    queryFn: getAccounts,
    enabled: isAuthenticated && !bypassSuperuser,
    networkMode: "always",
    staleTime: 0,
    refetchOnMount: "always",
  });

  const isSuperuser = useMemo(() => {
    if (!isAuthenticated || !username) return false;
    if (hasSuperuserBypass(username)) return true;
    return resolveIsSuperuser(data, username);
  }, [data, isAuthenticated, username]);

  return {
    isSuperuser,
    isLoading: isAuthenticated && !bypassSuperuser && isPending && !data,
    isFetching: isAuthenticated && !bypassSuperuser && isFetching,
  };
};
