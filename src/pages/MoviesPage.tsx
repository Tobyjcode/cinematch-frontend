import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/cinematchlogo.png";
import { getMovies } from "../api/movies";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../api/watchlist";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import { parseGenres } from "../utils/movie";

const PAGE_SIZE = 100;

export default function MoviesPage() {
  // Main movie data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchInput, setSearchInput] = useState(""); // raw input field
  const [search, setSearch] = useState(""); // applied search
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  // Load watchlist once on mount
  useEffect(() => {
    getWatchlist()
      .then(setWatchlist)
      .catch(console.error);
  }, []);

  // Fetch movies when filters/pagination change
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

        // Backend can return paginated or flat array
        if (Array.isArray(data)) {
          setMovies(data);
          setTotalPages(1);
        } else {
          setMovies(data.content ?? []);
          setTotalPages(data.totalPages ?? 1);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        console.error(err);
        setMovies([]);
        setTotalPages(1);
        setError(err instanceof Error ? err.message : "Failed to load movies");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Prevent state update if component unmounts
    return () => {
      cancelled = true;
    };
  }, [page, search, selectedGenre, sortBy, direction]);

  // Fast lookup for watchlist state
  const watchlistIds = useMemo(
    () => new Set(watchlist.map((movie) => movie.id)),
    [watchlist]
  );

  // Extract unique genres from loaded movies
  const allGenres = useMemo(() => {
    const genres = movies.flatMap((movie) => parseGenres(movie.genres));
    return ["All", ...Array.from(new Set(genres)).sort()];
  }, [movies]);

  function resetPage() {
    setPage(0);
  }

  // Apply search (prevents API call on every keystroke)
  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    resetPage();
    setSearch(searchInput.trim());
  }

  // Add/remove movie from watchlist
  async function toggleWatchlist(movie: Movie) {
    const isInWatchlist = watchlistIds.has(movie.id);

    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie.id);
        setWatchlist((current) =>
          current.filter((item) => item.id !== movie.id)
        );
        return;
      }

      const savedMovie = await addToWatchlist(movie.id);
      setWatchlist((current) => [...current, savedMovie]);
    } catch (err) {
      console.error(err);
    }
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

        {/* Genre filter */}
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

        {/* Sorting options */}
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

        {/* Sort direction */}
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

      {/* Pagination */}
      <div className="pagination-bar">
        <button
          className="page-button"
          onClick={() => setPage((current) => Math.max(current - 1, 0))}
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
            setPage((current) => Math.min(current + 1, totalPages - 1))
          }
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* Content states */}
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