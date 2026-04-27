import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;