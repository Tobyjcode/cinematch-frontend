import { apiFetch } from "./client";
import type { Movie } from "../components/MovieCard";

export async function getWatchlist() {
  const response = await apiFetch("/watchlist");

  if (!response.ok) {
    throw new Error("Failed to load watchlist");
  }

  return response.json() as Promise<Movie[]>;
}

export async function addToWatchlist(movieId: number) {
  const response = await apiFetch(`/watchlist/${movieId}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to add movie to watchlist");
  }

  return response.json() as Promise<Movie>;
}

export async function removeFromWatchlist(movieId: number) {
  const response = await apiFetch(`/watchlist/${movieId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove movie from watchlist");
  }
}