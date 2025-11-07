// src/pages/Movies.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Movies.css";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("https://movie-review-0044.onrender.comvv/api/movies");
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading)
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading movies...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  const genres = ["All", "Animation", "Sci-Fi", "Action", "Adventure", "Comedy", "Drama"];

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((movie) => {
          if (Array.isArray(movie.genre)) {
            return movie.genre.some(
              (g) => g.toLowerCase() === selectedGenre.toLowerCase()
            );
          } else {
            return movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
          }
        });

  const trendingMovies = filteredMovies.filter((m) => m.isTrending);
  const mostWatchedMovies = [...filteredMovies].sort((a, b) => b.views - a.views).slice(0, 10);
  const latestReleases = [...filteredMovies]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const moviesByGenre = {};
  genres.forEach((genre) => {
    if (genre !== "All") {
      moviesByGenre[genre] = movies.filter((movie) => {
        if (Array.isArray(movie.genre)) {
          return movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase());
        } else {
          return movie.genre.toLowerCase().includes(genre.toLowerCase());
        }
      });
    }
  });

  const renderMovieSection = (title, movieList) => (
    <div className="movie-section" key={title}>
      <h2 className="movies-title">{title}</h2>
      <div className="movies-grid">
        {movieList.length > 0 ? (
          movieList.map((movie) => (
            <div key={movie.title} className="movie-card">
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
              <div className="movie-info">
                <h5>{movie.title}</h5>
                <p>
                  {movie.year} • {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                </p>
                <span className="movie-rating">⭐ {movie.averageRating}</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#fff" }}>No movies found.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="movies-page">
      {/* Genre Filter as clickable circles */}
      <div className="genre-filter-circles" style={{ textAlign: "center", marginBottom: "20px" }}>
        {genres.map((genre) => (
          <span
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`genre-circle ${selectedGenre === genre ? "selected" : ""}`}
            style={{
              display: "inline-block",
              margin: "5px",
              padding: "10px 15px",
              borderRadius: "50%",
              backgroundColor: selectedGenre === genre ? "#f39c12" : "#555",
              color: "#fff",
              cursor: "pointer",
              userSelect: "none",
              transition: "0.3s",
            }}
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Existing Categories */}
      {renderMovieSection("🔥 Trending", trendingMovies)}
      {renderMovieSection("👀 Most Watched", mostWatchedMovies)}
      {renderMovieSection("🆕 Latest Releases", latestReleases)}

      {/* Movies by Genre */}
      {genres.filter((g) => g !== "All").map((genre) =>
        renderMovieSection(genre, moviesByGenre[genre])
      )}
    </div>
  );
}
