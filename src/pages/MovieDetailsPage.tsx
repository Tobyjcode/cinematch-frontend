import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieById } from "../api/movies";

type GenreObject = {
  id?: number;
  name?: string;
};

type Movie = {
  id: number;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath?: string | null;
  releaseDate?: string;
  originalLanguage?: string;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  runtime?: number;
  genres?: string | GenreObject[];
};

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getMovieById(id)
      .then(setMovie)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const genreNames = useMemo(() => parseGenres(movie?.genres), [movie?.genres]);

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

  const posterUrl = getPosterUrl(movie.posterPath);

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

        <div className="details-content">
          <p className="eyebrow">Movie Details</p>
          <h1 className="details-title">{movie.title}</h1>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="details-subtitle">Original title: {movie.originalTitle}</p>
          )}

          <div className="details-meta">
            {movie.releaseDate && <span className="badge">Release: {movie.releaseDate}</span>}
            {movie.runtime && <span className="badge">Runtime: {movie.runtime} min</span>}
            {movie.originalLanguage && (
              <span className="badge">Language: {movie.originalLanguage.toUpperCase()}</span>
            )}
          </div>

          <div className="details-meta">
            {movie.voteAverage !== undefined && (
              <span className="badge">Rating: {movie.voteAverage}</span>
            )}
            {movie.voteCount !== undefined && (
              <span className="badge">Votes: {movie.voteCount}</span>
            )}
            {movie.popularity !== undefined && (
              <span className="badge">Popularity: {movie.popularity}</span>
            )}
          </div>

          {genreNames.length > 0 && (
            <div className="genre-list">
              {genreNames.map((genre) => (
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