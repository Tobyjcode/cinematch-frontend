export type Genre = {
  id?: number;
  name?: string;
};

export type Movie = {
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
  genres?: Genre[] | string;
};

export type MoviePageResponse = {
  content: Movie[];
  totalPages: number;
};