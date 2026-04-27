import { Link } from "react-router-dom";
import { Star } from "lucide-react";

type Genre = {
  id?: number;
  name?: string;
};

export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath?: string | null;
  genres?: string | Genre[];
  voteAverage?: number;
  popularity?: number;
};

type Props = {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
};

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getPosterUrl(path?: string | null) {
  return path?.startsWith("/") ? `${IMAGE_BASE}${path}` : null;
}

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

export default function MovieCard({ movie, isInWatchlist, onToggleWatchlist }: Props) {
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
              <Star size={14} fill="#ffd166" stroke="#ffd166" />
              <span>{movie.voteAverage.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="movie-content">
          <h2 className="movie-title">{movie.title}</h2>

          <button
            className={`watchlist-button ${isInWatchlist ? "active" : ""}`}
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