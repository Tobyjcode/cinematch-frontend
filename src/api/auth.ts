import { apiFetch } from "./client";

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const body = await response.json();
      if (typeof body?.message === "string" && body.message.trim()) {
        return body.message;
      }
      return fallback;
    }

    const text = (await response.text()).trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

// 🔥 REGISTER (fixed JSON issue)
export async function register(
  username: string,
  password: string
): Promise<void> {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, "Register failed");
    throw new Error(message);
  }
}

// 🔐 LOGIN
export async function login(
  username: string,
  password: string
): Promise<void> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, "Login failed");
    throw new Error(message);
  }
}

// 👤 GET CURRENT USER
export async function getMe(): Promise<string> {
  const response = await apiFetch("/auth/me");

  if (!response.ok) {
    const message = await extractErrorMessage(response, "Not authenticated");
    throw new Error(message);
  }

  const text = await response.text();
  return text.trim();
}

// 🚪 LOGOUT
export async function logout(): Promise<void> {
  const response = await apiFetch("/logout", {
    method: "POST",
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, "Logout failed");
    throw new Error(message);
  }
}