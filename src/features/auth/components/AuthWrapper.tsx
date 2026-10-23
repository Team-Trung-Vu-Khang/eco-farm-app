import { type ReactNode, useEffect, useState } from "react";
import { AUTH_PATHS } from "../../../shared/constants/auth.constants";
import { authApi } from "../api/auth.api";
import { isUserAdmin } from "../hooks/useIsAdmin";
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

      // Kiểm tra quyền Admin của user đăng nhập/mới đăng ký
      let isAdmin = isUserAdmin(null, tokenFromUrl);
      try {
        const currentUser = await authApi.getCurrentUser(tokenFromUrl);
        isAdmin = isUserAdmin(currentUser, tokenFromUrl);
      } catch {
        // Fallback kiểm tra role từ token JWT
      }

      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam =
        searchParams.get("redirect") || searchParams.get("redirect_url");
      const savedRedirectPath = sessionStorage.getItem("redirect_path");
      sessionStorage.removeItem("redirect_path");

      let candidatePath =
        redirectParam ||
        (savedRedirectPath &&
        savedRedirectPath !== "/" &&
        !savedRedirectPath.startsWith(AUTH_PATHS.callback)
          ? savedRedirectPath
          : null);

      // Chặn người dùng không có quyền Admin điều hướng vào /enterprise
      if (
        candidatePath &&
        candidatePath.startsWith("/enterprise") &&
        !isAdmin
      ) {
        candidatePath = null;
      }

      // Nếu thuộc nhóm admin -> vào /enterprise (nếu không có redirect cụ thể)
      // Nếu là user thông thường -> vào / (dashboard hoặc mobile home)
      const targetPath = candidatePath || (isAdmin ? "/enterprise" : "/");

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
