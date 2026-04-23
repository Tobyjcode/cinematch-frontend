// src/api/auth.ts

const BASE_URL = "http://localhost:8080";

// 🔥 REGISTER (fixed JSON issue)
export async function register(
  username: string,
  password: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // ✅ REQUIRED
    },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }
}

// 🔐 LOGIN (Spring Security form login)
export async function login(
  username: string,
  password: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include", // ✅ important for session
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
}

// 👤 GET CURRENT USER
export async function getMe(): Promise<string> {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.text();
}

// 🚪 LOGOUT
export async function logout(): Promise<void> {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}