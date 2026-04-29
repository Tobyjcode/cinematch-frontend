import type { Movie, MoviePageResponse } from "../types/movie";
import { apiFetch } from "./client";

export type MoviesQuery = {
  page?: number;
  size?: number;
  search?: string;
  genre?: string;
  sortBy?: string;
  direction?: "asc" | "desc";
};

function buildMovieParams(query: MoviesQuery) {
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

  return params;
}

export async function getMovies(
  query: MoviesQuery = {}
): Promise<MoviePageResponse | Movie[]> {
  const params = buildMovieParams(query);
  const response = await apiFetch(`/movies?${params.toString()}`);

  return response.json();
}

export async function getMovieById(id: string | number): Promise<Movie> {
  const response = await apiFetch(`/movies/${id}`);

  return response.json();
}