import { useEffect, useState } from "react";
import { getMovies } from "../api/movies";

type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then((data) => {
        console.log("Movies:", data);
        setMovies(data.content || data); // handles Page<MovieDTO>
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Movies</h1>

      {movies.length === 0 ? (
        <p>No movies found</p>
      ) : (
        movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <h3>{movie.overview}</h3>
            <img
      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
      alt={movie.title}
      style={{ width: "200px" }}
    />
            
          </div>
        ))
      )}
    </div>
  );
}