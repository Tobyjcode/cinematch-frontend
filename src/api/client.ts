const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const fallbackApiBaseUrl = `http://${window.location.hostname}:8080`;

export const API_BASE_URL = (configuredApiBaseUrl || fallbackApiBaseUrl).replace(/\/$/, "");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    credentials: "include",
    headers,
  });
}