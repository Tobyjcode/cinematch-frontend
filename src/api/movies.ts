import { apiFetch } from "./client";

export async function getMovies() {
  const response = await apiFetch("/movies");

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}