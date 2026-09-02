import { apiClient } from "@/shared/lib/axios";
import type { AuthMeResponse, AuthProvider, WorkspaceRole } from "../types/auth.type";
import { AUTH_PATHS } from "../../../shared/constants/auth.constants";
import { authEnv } from "../../../shared/config/auth.env";
import { apiEnv } from "../../../shared/config/api.env";
import { buildApiUrl } from "../../../shared/config/api.config";

const AUTH_TOKEN_STORAGE_KEY = "accessToken";
const buildCallbackUrl = () =>
  `${window.location.origin}${authEnv.callbackPath}`;

export const authStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  },
  setToken(token: string) {
    sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  },
  clearToken() {
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  },
};

export const authApi = {
  getToken() {
    return authStorage.getToken();
  },
  setToken(token: string) {
    authStorage.setToken(token);
  },
  clearToken() {
    authStorage.clearToken();
  },
  getCallbackUrl() {
    return buildCallbackUrl();
  },
  buildLoginUrl(provider: AuthProvider) {
    const callbackUrl = this.getCallbackUrl();
    return `${buildApiUrl(
      apiEnv.apiBaseUrl,
      `${AUTH_PATHS.login}/${encodeURIComponent(provider)}`,
    )}?callback_url=${encodeURIComponent(callbackUrl)}`;
  },
  startLogin(provider: AuthProvider) {
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
    window.location.replace(this.buildLoginUrl(provider));
  },
  getCallbackToken() {
    return new URLSearchParams(window.location.search).get("token");
  },
  async getMe(token = authStorage.getToken(), workspaceId?: number | string | null) {
    return this.getCurrentUser(token, workspaceId);
  },
  async getCurrentUser(token = authStorage.getToken(), workspaceId?: number | string | null) {
    if (!token) {
      throw new Error("Missing auth token");
    }

    const response = await apiClient.get<AuthMeResponse>(AUTH_PATHS.me, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(workspaceId !== null && workspaceId !== undefined && workspaceId !== ""
          ? { "X-Workspace-Id": String(workspaceId) }
          : {}),
      },
    });

    return response.data;
  },
  async getWorkspaceRoles(workspaceId?: number | string | null, token = authStorage.getToken()): Promise<WorkspaceRole[]> {
    if (!token) throw new Error("Missing auth token");
    const response = await apiClient.get<WorkspaceRole[]>("/api/me/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(workspaceId !== null && workspaceId !== undefined && workspaceId !== ""
          ? { "X-Workspace-Id": String(workspaceId) }
          : {}),
      },
    });
    return response.data;
  },
  async logout() {
    const token = authStorage.getToken();

    if (!token) {
      window.location.replace(authEnv.postLogoutRedirectUri);
      return;
    }

    try {
      await apiClient.post(AUTH_PATHS.logout, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          post_logout_redirect_uri: authEnv.postLogoutRedirectUri,
        },
      });
    } catch {
      // Ignore logout API failures and still continue to redirect.
    } finally {
      authStorage.clearToken();
      window.location.replace(authEnv.postLogoutRedirectUri);
    }
  },
  getDefaultProvider() {
    return authEnv.provider;
  },
};
