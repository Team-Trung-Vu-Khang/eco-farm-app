import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authStorage } from "@/features/auth/api/auth.api";
import { SELECTED_WORKSPACE_STORAGE_KEY } from "@/features/workspace";
import { AUTH_PATHS } from "../constants/auth.constants";
import { apiClient } from "./axios";

type Handler = (config: InternalAxiosRequestConfig) => AxiosResponse | number;

const ok = (config: InternalAxiosRequestConfig, data: unknown = {}) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

// Giả lập server: trả response hoặc mã lỗi HTTP
const mockServer = (handler: Handler) => {
  const calls: InternalAxiosRequestConfig[] = [];
  apiClient.defaults.adapter = async (config) => {
    calls.push(config);
    const result = handler(config);
    if (typeof result === "number") {
      const response = { ...ok(config), status: result } as AxiosResponse;
      throw new AxiosError(
        `Request failed with status code ${result}`,
        AxiosError.ERR_BAD_REQUEST,
        config,
        null,
        response,
      );
    }
    return result;
  };
  return calls;
};

const authHeader = (config: InternalAxiosRequestConfig) =>
  AxiosHeaders.from(config.headers).get("Authorization");

const refreshError = (status: number) =>
  new AxiosError("refresh failed", AxiosError.ERR_BAD_REQUEST, undefined, null, {
    status,
  } as AxiosResponse);

describe("apiClient interceptors", () => {
  const replace = vi.fn();
  const originalLocation = window.location;
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    sessionStorage.clear();
    replace.mockReset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, replace },
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    apiClient.defaults.adapter = originalAdapter;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("gắn Authorization và X-Workspace-Id từ storage", async () => {
    authStorage.setToken("t1");
    sessionStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, "7");
    const calls = mockServer((c) => ok(c));

    await apiClient.get("/farms");

    expect(authHeader(calls[0])).toBe("Bearer t1");
    expect(AxiosHeaders.from(calls[0].headers).get("X-Workspace-Id")).toBe("7");
  });

  it("bỏ X-Workspace-Id khi có skipWorkspaceHeader", async () => {
    sessionStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, "7");
    const calls = mockServer((c) => ok(c));

    await apiClient.get("/me", { headers: { skipWorkspaceHeader: true } });

    const headers = AxiosHeaders.from(calls[0].headers);
    expect(headers.has("X-Workspace-Id")).toBe(false);
    expect(headers.has("skipWorkspaceHeader")).toBe(false);
  });

  it("401 → refresh token → gửi lại request với token mới", async () => {
    authStorage.setToken("old");
    const calls = mockServer((c) =>
      authHeader(c) === "Bearer new" ? ok(c, { id: 1 }) : 401,
    );
    const post = vi
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { access_token: "new" } });

    const res = await apiClient.get("/farms");

    expect(res.data).toEqual({ id: 1 });
    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0][0]).toBe(AUTH_PATHS.refresh);
    expect(authStorage.getToken()).toBe("new");
    expect(calls).toHaveLength(2);
  });

  it("chấp nhận refresh trả về token dạng string", async () => {
    authStorage.setToken("old");
    mockServer((c) => (authHeader(c) === "Bearer new" ? ok(c) : 401));
    vi.spyOn(axios, "post").mockResolvedValue({ data: "new" });

    await apiClient.get("/farms");

    expect(authStorage.getToken()).toBe("new");
  });

  it("nhiều request 401 cùng lúc chỉ refresh 1 lần, tất cả đều được gửi lại", async () => {
    authStorage.setToken("old");
    mockServer((c) => (authHeader(c) === "Bearer new" ? ok(c, c.url) : 401));
    let resolveRefresh!: (v: unknown) => void;
    const post = vi.spyOn(axios, "post").mockReturnValue(
      new Promise((r) => {
        resolveRefresh = r;
      }),
    );

    const pending = Promise.all([
      apiClient.get("/a"),
      apiClient.get("/b"),
      apiClient.get("/c"),
    ]);
    await vi.waitFor(() => expect(post).toHaveBeenCalled());
    resolveRefresh({ data: { access_token: "new" } });

    const results = await pending;
    expect(results.map((r) => r.data)).toEqual(["/a", "/b", "/c"]);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("refresh lỗi → xoá token, chuyển về trang login và reject các request đang chờ", async () => {
    authStorage.setToken("old");
    sessionStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, "7");
    mockServer(() => 401);
    let rejectRefresh!: (e: unknown) => void;
    const post = vi.spyOn(axios, "post").mockReturnValue(
      new Promise((_, r) => {
        rejectRefresh = r;
      }),
    );

    const first = apiClient.get("/a");
    const second = apiClient.get("/b");
    await vi.waitFor(() => expect(post).toHaveBeenCalled());
    rejectRefresh(refreshError(401));

    await expect(first).rejects.toThrow();
    await expect(second).rejects.toThrow();
    expect(authStorage.getToken()).toBeNull();
    expect(sessionStorage.getItem(SELECTED_WORKSPACE_STORAGE_KEY)).toBeNull();
    expect(replace).toHaveBeenCalled();
  });

  it("401 từ chính endpoint refresh → logout, không lặp refresh", async () => {
    authStorage.setToken("old");
    mockServer(() => 401);
    const post = vi.spyOn(axios, "post");

    await expect(apiClient.post(AUTH_PATHS.refresh)).rejects.toThrow();

    expect(post).not.toHaveBeenCalled();
    expect(authStorage.getToken()).toBeNull();
    expect(replace).toHaveBeenCalled();
  });

  it("request đã retry mà vẫn 401 thì không refresh lần nữa", async () => {
    authStorage.setToken("old");
    const calls = mockServer(() => 401);
    const post = vi
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { access_token: "new" } });

    await expect(apiClient.get("/farms")).rejects.toThrow();

    expect(post).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
  });

  it("lỗi khác 401 không refresh, giữ nguyên response để xử lý fieldErrors", async () => {
    mockServer(() => 500);
    const post = vi.spyOn(axios, "post");

    const error = await apiClient.get("/farms").catch((e) => e);

    expect(post).not.toHaveBeenCalled();
    expect(axios.isAxiosError(error)).toBe(true);
    expect(error.response.status).toBe(500);
    expect(typeof error.message).toBe("string");
  });
});
