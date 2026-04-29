import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWatchlist, removeFromWatchlist } from "../api/watchlist";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWatchlist()
      .then(setWatchlist)
      .catch((err) => {
        console.error(err);
        setError("Failed to load watchlist");
      });
  }, []);

  async function removeMovie(movie: Movie) {
    try {
      await removeFromWatchlist(movie.id);

      setWatchlist((current) =>
        current.filter((item) => item.id !== movie.id)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to remove movie from watchlist");
    }
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
        <p className="subtitle">Movies saved to your account</p>
      </div>

      {error ? (
        <div className="status-card">{error}</div>
      ) : watchlist.length === 0 ? (
        <div className="status-card">Your watchlist is empty.</div>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist
              onToggleWatchlist={removeMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
}