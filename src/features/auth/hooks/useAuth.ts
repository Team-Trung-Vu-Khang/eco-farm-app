import { authApi } from "../api/auth.api";
import type { AuthProvider } from "../types/auth.type";
import { useCurrentUser } from "./useCurrentUser";

export function useAuth() {
  const { token, currentUser, loadingCurrentUser } = useCurrentUser();

  const login = (
    provider: AuthProvider = authApi.getDefaultProvider(),
  ) => authApi.startLogin(provider);

  const logout = () => {
    return authApi.logout();
  };

  return {
    token,
    isAuthenticated: Boolean(token),
    currentUser,
    loadingCurrentUser,
    login,
    logout,
    clearSession: () => {
      authApi.logout();
    },
  };
}
