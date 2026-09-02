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

      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam =
        searchParams.get("redirect") || searchParams.get("redirect_url");
      const savedRedirectPath = sessionStorage.getItem("redirect_path");
      sessionStorage.removeItem("redirect_path");

      const targetPath =
        redirectParam ||
        (savedRedirectPath &&
        savedRedirectPath !== "/" &&
        !savedRedirectPath.startsWith(AUTH_PATHS.callback)
          ? savedRedirectPath
          : "/enterprise");

      window.location.replace(targetPath);
      return;
    }

    const token = authApi.getToken();

    if (!token) {
      const currentPath =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      if (
        currentPath &&
        currentPath !== "/" &&
        !currentPath.startsWith(AUTH_PATHS.callback)
      ) {
        sessionStorage.setItem("redirect_path", currentPath);
      }
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
