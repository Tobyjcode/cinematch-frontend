import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard, { type Movie } from "../components/MovieCard";

const WATCHLIST_KEY = "cinematch-watchlist";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(WATCHLIST_KEY);
    setWatchlist(saved ? JSON.parse(saved) : []);
  }, []);

  function toggleWatchlist(movie: Movie) {
    const updated = watchlist.some((item) => item.id === movie.id)
      ? watchlist.filter((item) => item.id !== movie.id)
      : [...watchlist, movie];

    setWatchlist(updated);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  }

  return (
    <div className="movies-page">
      <div className="app-header">
        <Link to="/movies" className="watchlist-link">
          ← Back to Movies
        </Link>
      </div>

      <div className="movies-header">
        <h1>Your Watchlist</h1>
        <p className="subtitle">Movies you saved for later</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="status-card">Your watchlist is empty.</div>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={true}
              onToggleWatchlist={toggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}