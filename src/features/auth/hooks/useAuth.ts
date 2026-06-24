import { useEffect, useState } from "react";
import axios from "axios";
import { authApi } from "../api/auth.api";
import type { AuthMeResponse, AuthProvider } from "../types/auth.type";

export function useAuth() {
  const token = authApi.getToken();
  const [currentUser, setCurrentUser] = useState<AuthMeResponse | null>(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(Boolean(token));

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        setLoadingCurrentUser(false);
        return;
      }

      setLoadingCurrentUser(true);

      try {
        const user = await authApi.getCurrentUser(token);
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          void authApi.logout();
          return;
        }

        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoadingCurrentUser(false);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

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
      setCurrentUser(null);
    },
  };
}
