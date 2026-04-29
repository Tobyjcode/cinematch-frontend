import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/movies";
import type { Movie } from "../types/movie";
import { getPosterUrl, parseGenres } from "../utils/movie";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;

    getMovieById(id)
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const genres = useMemo(() => parseGenres(movie?.genres), [movie?.genres]);
  const posterUrl = getPosterUrl(movie?.posterPath);

  if (loading) {
    return (
      <div className="details-page">
        <div className="status-card">Loading movie...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="details-page">
        <div className="status-card">Movie not found.</div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <Link className="back-link" to="/movies">
        ← Back to movies
      </Link>

      <div className="details-card">
        <div className="details-poster-wrap">
          {posterUrl ? (
            <img
              className="details-poster"
              src={posterUrl}
              alt={movie.title}
              onError={(event) => {
                event.currentTarget.src = "/no-poster.png";
              }}
            />
          ) : (
            <div className="no-poster">No poster</div>
          )}
        </div>

        <div className="details-content">
          <p className="eyebrow">Movie Details</p>
          <h1 className="details-title">{movie.title}</h1>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="details-subtitle">
              Original title: {movie.originalTitle}
            </p>
          )}

          <div className="details-meta">
            {movie.releaseDate && (
              <span className="badge">Release: {movie.releaseDate}</span>
            )}
            {movie.runtime && (
              <span className="badge">Runtime: {movie.runtime} min</span>
            )}
            {movie.originalLanguage && (
              <span className="badge">
                Language: {movie.originalLanguage.toUpperCase()}
              </span>
            )}
          </div>

          <div className="details-meta">
            {movie.voteAverage !== undefined && (
              <span className="badge">
                Rating: {movie.voteAverage.toFixed(1)}
              </span>
            )}
            {movie.voteCount !== undefined && (
              <span className="badge">Votes: {movie.voteCount}</span>
            )}
            {movie.popularity !== undefined && (
              <span className="badge">
                Popularity: {movie.popularity.toFixed(1)}
              </span>
            )}
          </div>

          {genres.length > 0 && (
            <div className="genre-list">
              {genres.map((genre) => (
                <span className="genre-chip" key={genre}>
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className="details-overview">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}