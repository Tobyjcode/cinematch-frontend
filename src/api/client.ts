const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Fallback for local dev (same host, backend on :8080)
const fallbackApiBaseUrl = `http://${window.location.hostname}:8080`;

// Final base URL (no trailing slash)
export const API_BASE_URL = (configuredApiBaseUrl || fallbackApiBaseUrl).replace(/\/$/, "");

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    // Optional: centralize error handling
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response;
}