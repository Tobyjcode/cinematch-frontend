const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Fallback: use current host (works for hotspot / LAN)
const fallbackApiBaseUrl = `http://${window.location.hostname}:8080`;

// Use env if provided (Cloudflare), otherwise fallback
const API_BASE_URL = (configuredApiBaseUrl || fallbackApiBaseUrl).replace(/\/$/, "");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${API_BASE_URL}${normalizedPath}`, {
    credentials: "include", // important for session login
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}