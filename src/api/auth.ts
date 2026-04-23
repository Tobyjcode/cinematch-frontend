import { apiFetch } from "./client";

export async function register(
  username: string,
  password: string
): Promise<void> {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }
}

export async function login(username: string, password: string): Promise<void> {
  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
}

export async function getMe() {
  const response = await apiFetch("/auth/me");

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.text();
}

export async function logout(): Promise<void> {
  const response = await apiFetch("/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}