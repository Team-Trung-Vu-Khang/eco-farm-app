export const authEnv = {
  provider: import.meta.env.VITE_AUTH_PROVIDER,
  callbackPath: import.meta.env.VITE_AUTH_CALLBACK_PATH,
  postLogoutRedirectUri: import.meta.env.VITE_AUTH_POST_LOGOUT_REDIRECT_URI,
};
