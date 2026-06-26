import axios, { type InternalAxiosRequestConfig } from "axios";
import { authEnv } from "../config/auth.env";
import { authStorage } from "@/features/auth/api/auth.api";
import { AUTH_PATHS } from "../constants/auth.constants";

/**
 * Shared axios instance cho toàn bộ Foundation APIs.
 * - baseURL: đọc từ VITE_API_BASE_URL
 * - timeout: 30s
 * - Interceptors: xử lý lỗi tập trung (401, network error, v.v.)
 */
export const apiClient = axios.create({
  baseURL: authEnv.apiBaseUrl,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Thêm auth token nếu cần (ví dụ: Bearer token từ store)
    const token = authStorage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401 && originalRequest && !originalRequest._retry) {
        // Tránh vòng lặp vô hạn nếu chính request refresh cũng bị 401
        if (originalRequest.url?.includes(AUTH_PATHS.refresh)) {
          authStorage.clearToken();
          window.location.replace(authEnv.postLogoutRedirectUri || "/");
          return Promise.reject(error);
        }

        if (isRefreshing) {
          try {
            const token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const oldToken = authStorage.getToken();
          const { data } = await axios.post<any>(AUTH_PATHS.refresh, null, {
            baseURL: authEnv.apiBaseUrl,
            headers: {
              Authorization: `Bearer ${oldToken}`,
            },
          });

          const newToken = typeof data === "string" ? data : data.access_token;

          if (!newToken) {
            throw new Error("Invalid token response");
          }

          authStorage.setToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          authStorage.clearToken();

          // Redirect về login do refresh token thất bại / hết hạn session
          console.warn("[apiClient] Refresh token failed — redirect to login");
          window.location.replace(authEnv.postLogoutRedirectUri || "/");

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        console.warn("[apiClient] 403 Forbidden");
      }

      if (!error.response) {
        // Network error / timeout
        console.error("[apiClient] Network error:", error.message);
      }
    }

    return Promise.reject(error);
  },
);
