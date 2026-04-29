import { apiFetch } from "./client";

type AuthRequest = {
  username: string;
  password: string;
};

export async function register(username: string, password: string): Promise<void> {
  const body: AuthRequest = { username, password };

  await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function login(username: string, password: string): Promise<void> {
  const body: AuthRequest = { username, password };

  await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMe(): Promise<string> {
  const response = await apiFetch("/auth/me");
  return (await response.text()).trim();
}

export async function logout(): Promise<void> {
  await apiFetch("/logout", {
    method: "POST",
  });
}