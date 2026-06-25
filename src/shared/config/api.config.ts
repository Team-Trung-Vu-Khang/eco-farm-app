export const API_REQUEST_TIMEOUT = 30000;

export const buildApiUrl = (baseUrl: string | undefined, path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
};
