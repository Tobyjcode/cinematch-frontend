import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/cinematchlogo.png";
import { getMovies } from "../api/movies";
import MovieCard, { type Movie } from "../components/MovieCard";

const PAGE_SIZE = 100;
const WATCHLIST_KEY = "cinematch-watchlist";

type Genre = {
  id?: number;
  name?: string;
};

function parseGenres(genres?: string | Genre[]) {
  if (!genres) return [];

  if (Array.isArray(genres)) {
    return genres
      .map((genre) => genre.name)
      .filter((name): name is string => Boolean(name));
  }

  const extracted = [...genres.matchAll(/name['"]?\s*:\s*'([^']+)'/g)].map(
    (match) => match[1]
  );

  return extracted.length
    ? extracted
    : genres.split(",").map((genre) => genre.trim()).filter(Boolean);
}

function getSavedWatchlist() {
  const saved = localStorage.getItem(WATCHLIST_KEY);
  return saved ? (JSON.parse(saved) as Movie[]) : [];
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>(getSavedWatchlist);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    let cancelled = false;

    getMovies({
      page,
      size: PAGE_SIZE,
      search,
      genre: selectedGenre,
      sortBy,
      direction,
    })
      .then((data) => {
        if (cancelled) return;

        setError(null);

        if (Array.isArray(data)) {
          setMovies(data);
          setTotalPages(1);
        } else {
          setMovies(data.content ?? []);
          setTotalPages(data.totalPages ?? 1);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
        if (cancelled) return;

        setMovies([]);
        setTotalPages(1);
        setError(err instanceof Error ? err.message : "Failed to load movies");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, selectedGenre, sortBy, direction]);

  const watchlistIds = useMemo(
    () => new Set(watchlist.map((movie) => movie.id)),
    [watchlist]
  );

  const allGenres = useMemo(() => {
    const set = new Set<string>();

    movies.forEach((movie) => {
      parseGenres(movie.genres).forEach((genre) => set.add(genre));
    });

    return ["All", ...Array.from(set).sort()];
  }, [movies]);

  function resetPage() {
    setPage(0);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    resetPage();
    setSearch(searchInput);
  }

  function toggleWatchlist(movie: Movie) {
    setWatchlist((current) =>
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie]
    );
  }

  return (
    <div className="movies-page">
      <div className="app-header">
        <Link to="/movies" className="brand-link">
          <img className="brand-logo" src={logo} alt="Cinematch logo" />
        </Link>

        <Link to="/watchlist" className="watchlist-link">
          Watchlist ({watchlist.length})
        </Link>
      </div>

      <div className="movies-header">
        <h1>Movies</h1>
        <p className="subtitle">Browse your movie collection</p>
      </div>

      <form className="filters-bar" onSubmit={handleSearchSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Search movies..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <button className="page-button" type="submit">
          Search
        </button>

        <select
          className="filter-select"
          value={selectedGenre}
          onChange={(event) => {
            resetPage();
            setSelectedGenre(event.target.value);
          }}
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
          onChange={(event) => {
            resetPage();
            setSortBy(event.target.value);
          }}
        >
          <option value="title">Sort: Title</option>
          <option value="voteAverage">Sort: Rating</option>
          <option value="popularity">Sort: Popularity</option>
          <option value="releaseDate">Sort: Release Date</option>
        </select>

        <select
          className="filter-select"
          value={direction}
          onChange={(event) => {
            resetPage();
            setDirection(event.target.value as "asc" | "desc");
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </form>

      <div className="pagination-bar">
        <button
          className="page-button"
          onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>

        <span className="page-indicator">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>

        <button
          className="page-button"
          onClick={() =>
            setPage((currentPage) => Math.min(currentPage + 1, totalPages - 1))
          }
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {loading ? (
        <div className="status-card">Loading movies...</div>
      ) : error ? (
        <div className="status-card">{error}</div>
      ) : movies.length === 0 ? (
        <div className="status-card">
          No movies in database yet. Add or import movies first.
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={watchlistIds.has(movie.id)}
              onToggleWatchlist={toggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}