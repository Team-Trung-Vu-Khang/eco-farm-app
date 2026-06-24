export const AUTH_PATHS = {
  callback: "/auth/callback",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
} as const;

export const AUTH_DEFAULT_POST_LOGOUT_REDIRECT_URI =
  "https://mevi-center.otechz.com/";
