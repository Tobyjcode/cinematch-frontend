import type { Movie } from "../types/movie";
import { apiFetch } from "./client";

export async function getWatchlist(): Promise<Movie[]> {
  const response = await apiFetch("/watchlist");
  return response.json();
}

export async function addToWatchlist(movieId: number): Promise<Movie> {
  const response = await apiFetch(`/watchlist/${movieId}`, {
    method: "POST",
  });

  return response.json();
}

export async function removeFromWatchlist(movieId: number): Promise<void> {
  await apiFetch(`/watchlist/${movieId}`, {
    method: "DELETE",
  });
}