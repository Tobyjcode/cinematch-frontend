import { useEffect, useMemo, useState } from "react";
import { getMovies } from "../api/movies";

type Movie = {
  id: number;
  tmdbId?: number;
  title: string;
  overview: string;
  posterPath?: string | null;
};

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getPosterUrl(posterPath?: string | null) {
  if (!posterPath || !posterPath.startsWith("/")) {
    return null;
  }

  return `${IMAGE_BASE}${posterPath}?v=1`;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data.content || data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return movies;

    return movies.filter((movie) => {
      return (
        movie.title.toLowerCase().includes(query) ||
        movie.overview.toLowerCase().includes(query)
      );
    });
  }, [movies, search]);

  return (
    <div className="movies-page">
      <div className="movies-header">
        <div>
          <p className="eyebrow">Cinematch</p>
          <h1>Movies</h1>
          <p className="subtitle">Browse your movie collection</p>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="status-card">Loading movies...</div>
      ) : filteredMovies.length === 0 ? (
        <div className="status-card">No movies found.</div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => {
            const posterUrl = getPosterUrl(movie.posterPath);

            return (
              <article className="movie-card" key={`${movie.id}-${movie.posterPath ?? "no-poster"}`}>
                <div className="poster-wrap">
                  {posterUrl ? (
                    <img
                      className="movie-poster"
                      src={posterUrl}
                      alt={movie.title}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;

                        if (img.dataset.broken === "true") return;

                        img.dataset.broken = "true";
                        img.onerror = null;
                        img.src = "/no-poster.png";
                      }}
                    />
                  ) : (
                    <div className="no-poster">No poster</div>
                  )}
                </div>

                <div className="movie-content">
                  <h2 className="movie-title">{movie.title}</h2>
                  <p className="movie-overview">{movie.overview}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}