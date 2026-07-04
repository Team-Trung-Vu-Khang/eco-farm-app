import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authApi } from "../api/auth.api";
import type { AuthMeResponse } from "../types/auth.type";

export const authCurrentUserKeys = {
  all: ["auth-current-user"] as const,
  byToken: (token: string | null | undefined) =>
    ["auth-current-user", token ?? ""] as const,
};

interface UseCurrentUserOptions {
  enabled?: boolean;
}

export function useCurrentUser(
  { enabled = true }: UseCurrentUserOptions = {},
) {
  const token = authApi.getToken();

  const queryResult = useQuery<AuthMeResponse, Error>({
    queryKey: authCurrentUserKeys.byToken(token),
    queryFn: () => authApi.getCurrentUser(token),
    enabled: enabled && Boolean(token),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (
      axios.isAxiosError(queryResult.error) &&
      queryResult.error.response?.status === 403
    ) {
      void authApi.logout();
    }
  }, [queryResult.error]);

  return {
    ...queryResult,
    currentUser: queryResult.data ?? null,
    loadingCurrentUser: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
    token,
  };
}
