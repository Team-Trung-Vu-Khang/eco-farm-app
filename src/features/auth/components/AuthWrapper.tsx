import { type ReactNode, useEffect, useState } from "react";
import { AUTH_PATHS } from "../../../shared/constants/auth.constants";
import { authApi } from "../api/auth.api";
import { AuthLoadingState } from "./AuthLoadingState";

export function AuthWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const isCallbackRoute = window.location.pathname.startsWith(
    AUTH_PATHS.callback,
  );
  const run = async () => {
    if (isCallbackRoute) {
      const tokenFromUrl = authApi.getCallbackToken();

      if (!tokenFromUrl) {
        authApi.startLogin(authApi.getDefaultProvider());
        return;
      }

      authApi.setToken(tokenFromUrl);
      window.location.replace("/");
      return;
    }

    const token = authApi.getToken();

    if (!token) {
      authApi.startLogin(authApi.getDefaultProvider());
      return;
    }

    setIsReady(true);
  };

  useEffect(() => {
    run();
  }, [isCallbackRoute]);

  if (!isReady) {
    return <AuthLoadingState />;
  }

  return <>{children}</>;
}
