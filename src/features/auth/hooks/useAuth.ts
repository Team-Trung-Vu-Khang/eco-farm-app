import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authApi } from "../api/auth.api";
import type { AuthMeResponse, AuthProvider } from "../types/auth.type";

export function useAuth() {
  const token = authApi.getToken();
  const currentUserQuery = useQuery<AuthMeResponse, Error>({
    queryKey: ["auth-current-user", token ?? ""],
    queryFn: () => authApi.getCurrentUser(token),
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (
      axios.isAxiosError(currentUserQuery.error) &&
      currentUserQuery.error.response?.status === 403
    ) {
      void authApi.logout();
    }
  }, [currentUserQuery.error]);

  const login = (
    provider: AuthProvider = authApi.getDefaultProvider(),
  ) => authApi.startLogin(provider);

  const logout = () => {
    return authApi.logout();
  };

  return {
    token,
    isAuthenticated: Boolean(token),
    currentUser: currentUserQuery.data ?? null,
    loadingCurrentUser: currentUserQuery.isLoading,
    login,
    logout,
    clearSession: () => {
      authApi.logout();
    },
  };
}
