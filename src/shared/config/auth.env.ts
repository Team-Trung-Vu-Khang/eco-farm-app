import {
  AUTH_DEFAULT_POST_LOGOUT_REDIRECT_URI,
  AUTH_PATHS,
} from "../constants/auth.constants";

export const authEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  provider: import.meta.env.VITE_AUTH_PROVIDER,
  callbackPath: import.meta.env.VITE_AUTH_CALLBACK_PATH || AUTH_PATHS.callback,
  postLogoutRedirectUri:
    import.meta.env.VITE_AUTH_POST_LOGOUT_REDIRECT_URI ||
    AUTH_DEFAULT_POST_LOGOUT_REDIRECT_URI,
};
