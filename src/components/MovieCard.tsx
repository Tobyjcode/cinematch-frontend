import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { getPosterUrl, parseGenres } from "../utils/movie";

type Props = {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
};

export default function MovieCard({
  movie,
  isInWatchlist,
  onToggleWatchlist,
}: Props) {
  const posterUrl = getPosterUrl(movie.posterPath);
  const genres = parseGenres(movie.genres);

  return (
    <Link className="movie-card-link" to={`/movies/${movie.id}`}>
      <article className="movie-card">
        <div className="poster-wrap">
          {posterUrl ? (
            <img
              className="movie-poster"
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = "/no-poster.png";
              }}
            />
          ) : (
            <div className="no-poster">No poster</div>
          )}

          {movie.voteAverage != null && (
            <div className="poster-rating">
              <Star size={14} />
              <span>{movie.voteAverage.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="movie-content">
          <h2 className="movie-title">{movie.title}</h2>

          {/* Prevents the card link from opening when clicking the button. */}
          <button
            className={`watchlist-button ${isInWatchlist ? "active" : ""}`}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onToggleWatchlist(movie);
            }}
          >
            {isInWatchlist ? "✓ Added" : "+ Watchlist"}
          </button>

          {genres.length > 0 && (
            <div className="card-genre-list">
              {genres.slice(0, 3).map((genre) => (
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
}