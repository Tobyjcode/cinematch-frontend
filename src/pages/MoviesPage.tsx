import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../api/movies";

type GenreObject = {
  id?: number;
  name?: string;
};

type Movie = {
  id: number;
  tmdbId?: number;
  title: string;
  overview: string;
  posterPath?: string | null;
  genres?: string | GenreObject[];
  voteAverage?: number;
  popularity?: number;
};

type MoviePageResponse = {
  content: Movie[];
  totalPages?: number;
};

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const PAGE_SIZE = 100;

function getPosterUrl(posterPath?: string | null) {
  if (!posterPath || !posterPath.startsWith("/")) {
    return null;
  }

  return `${IMAGE_BASE}${posterPath}?v=1`;
}

function parseGenres(genres?: string | GenreObject[]) {
  if (!genres) return [];

  if (Array.isArray(genres)) {
    return genres
      .map((genre) => genre?.name)
      .filter((name): name is string => Boolean(name));
  }

  const extractedNames = [...genres.matchAll(/name['"]?\s*:\s*'([^']+)'/g)].map(
    (match) => match[1]
  );

  if (extractedNames.length > 0) {
    return extractedNames;
  }

  return genres
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setLoading(true);

    getMovies({
      page,
      size: PAGE_SIZE,
      search,
      genre: selectedGenre,
      sortBy,
      direction,
    })
      .then((data: MoviePageResponse | Movie[]) => {
        if (Array.isArray(data)) {
          setMovies(data);
          setTotalPages(1);
          return;
        }

        setMovies(data.content || []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page, search, selectedGenre, sortBy, direction]);

  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();

    movies.forEach((movie) => {
      parseGenres(movie.genres).forEach((genre) => genreSet.add(genre));
    });

    return ["All", ...Array.from(genreSet).sort()];
  }, [movies]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  }

  function handleGenreChange(value: string) {
    setPage(0);
    setSelectedGenre(value);
  }

  function handleSortChange(value: string) {
    setPage(0);
    setSortBy(value);
  }

  function handleDirectionChange(value: "asc" | "desc") {
    setPage(0);
    setDirection(value);
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <div>
          <p className="eyebrow">Cinematch</p>
          <h1>Movies</h1>
          <p className="subtitle">Browse your movie collection</p>
        </div>
      </div>

      <form className="filters-bar" onSubmit={handleSearchSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Search movies..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button className="page-button" type="submit">
          Search
        </button>

        <select
          className="filter-select"
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e.target.value)}
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="title">Sort: Title</option>
          <option value="voteAverage">Sort: Rating</option>
          <option value="popularity">Sort: Popularity</option>
          <option value="releaseDate">Sort: Release Date</option>
        </select>

        <select
          className="filter-select"
          value={direction}
          onChange={(e) => handleDirectionChange(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </form>

      <div className="pagination-bar">
        <button
          className="page-button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>

        <span className="page-indicator">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>

        <button
          className="page-button"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {loading ? (
        <div className="status-card">Loading movies...</div>
      ) : movies.length === 0 ? (
        <div className="status-card">No movies found.</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => {
            const posterUrl = getPosterUrl(movie.posterPath);

            return (
              <Link
                className="movie-card-link"
                to={`/movies/${movie.id}`}
                key={`${movie.id}-${movie.posterPath ?? "no-poster"}`}
              >
                <article className="movie-card">
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

                    {parseGenres(movie.genres).length > 0 && (
                      <div className="card-genre-list">
                        {parseGenres(movie.genres)
                          .slice(0, 3)
                          .map((genre) => (
                            <span className="genre-chip small" key={genre}>
                              {genre}
                            </span>
                          ))}
                      </div>
                    )}

                    <p className="movie-overview">{movie.overview}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}