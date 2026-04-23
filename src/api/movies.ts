import { apiFetch } from "./client";

export type MoviesQuery = {
  page?: number;
  size?: number;
  search?: string;
  genre?: string;
  sortBy?: string;
  direction?: "asc" | "desc";
};

export async function getMovies(query: MoviesQuery = {}) {
  const params = new URLSearchParams();

  params.set("page", String(query.page ?? 0));
  params.set("size", String(query.size ?? 100));
  params.set("sortBy", query.sortBy ?? "title");
  params.set("direction", query.direction ?? "asc");

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.genre?.trim() && query.genre !== "All") {
    params.set("genre", query.genre.trim());
  }

  const response = await apiFetch(`/movies?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
}

export async function getMovieById(id: string | number) {
  const response = await apiFetch(`/movies/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
}