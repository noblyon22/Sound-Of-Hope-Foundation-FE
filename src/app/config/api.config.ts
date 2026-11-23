export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  version: import.meta.env.VITE_API_VERSION ?? "v1",
  timeout: 30_000,
} as const;

export const API_BASE = `${API_CONFIG.baseURL}/api/${API_CONFIG.version}`;
