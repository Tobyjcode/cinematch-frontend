import type { Genre } from "../types/movie";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export function getPosterUrl(path?: string | null) {
  if (!path || !path.startsWith("/")) return null;
  return `${IMAGE_BASE}${path}`;
}

export function parseGenres(genres?: string | Genre[]) {
  if (!genres) return [];

  if (Array.isArray(genres)) {
    return genres
      .map((g) => g.name)
      .filter((name): name is string => Boolean(name));
  }

  // Try to extract "name: 'Action'" style strings
  const matches = [...genres.matchAll(/name['"]?\s*:\s*'([^']+)'/g)];
  if (matches.length > 0) {
    return matches.map((m) => m[1]);
  }

  // Fallback: comma-separated string
  return genres
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}