// src/pages/Home.js
import React, { useEffect, useState, useRef, useMemo } from "react";
import API from "../api";
import MovieCard from "../components/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const popularRef = useRef(null);
  const trendingRef = useRef(null);
  const topRatedRef = useRef(null);
  const newReleasesRef = useRef(null);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        if (Array.isArray(res.data)) setMovies(res.data);
        else if (res.data.movies && Array.isArray(res.data.movies))
          setMovies(res.data.movies);
        else setMovies([]);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Hero carousel auto-change
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % movies.length);
    }, 8000); // every 8s
    return () => clearInterval(interval);
  }, [movies]);

  const scrollRow = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filtered categories using useMemo for performance
  const trending = useMemo(() => movies.filter((m) => m.rating >= 4), [movies]);
  const topRated = useMemo(
    () => movies.filter((m) => m.averageRating >= 4.5),
    [movies]
  );
  const newReleases = useMemo(
    () => movies.filter((m) => Number(m.year) >= 2023),
    [movies]
  );

  const heroMovie = movies[heroIndex];

  // Movie row component
  const MovieRow = ({ title, moviesList, refObj }) => (
    <div className="section">
      <h2>{title}</h2>
      <div className="slider-wrapper">
        <button
          className="scroll-btn left"
          onClick={() => scrollRow(refObj, "left")}
        >
          <ChevronLeft size={32} />
        </button>
        <div className="movie-row" ref={refObj}>
          {moviesList.length > 0 ? (
            moviesList.map((movie) => (
              <MovieCard key={movie.id || movie.title} movie={movie} />
            ))
          ) : (
            <p className="loading">No movies found.</p>
          )}
        </div>
        <button
          className="scroll-btn right"
          onClick={() => scrollRow(refObj, "right")}
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {/* Top-right login/register buttons */}
      {!user && (
        <div className="top-auth-buttons">
          <Link to="/login" className="btn btn-login">
            Login
          </Link>
          <Link to="/register" className="btn btn-register">
            Register
          </Link>
        </div>
      )}

      {/* Hero Banner */}
      {heroMovie && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url(${
              heroMovie.poster || "https://via.placeholder.com/1200x600?text=No+Poster"
            })`,
          }}
        >
          <div className="hero-overlay">
            <h1 className="hero-title">{heroMovie.title}</h1>
            <p className="hero-description">
              {heroMovie.description || "No description available."}
            </p>
            <div className="hero-buttons">
              <button className="btn btn-watch">▶ Watch Now</button>
              <button className="btn btn-watchlist">+ Watchlist</button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Rows */}
      {loading ? (
        <p className="loading">Loading movies...</p>
      ) : (
        <>
          <MovieRow title="🎬 Popular Movies" moviesList={movies} refObj={popularRef} />
          <MovieRow title="🔥 Trending" moviesList={trending} refObj={trendingRef} />
          <MovieRow title="⭐ Top Rated" moviesList={topRated} refObj={topRatedRef} />
          <MovieRow title="🆕 New Releases" moviesList={newReleases} refObj={newReleasesRef} />
        </>
      )}
    </div>
  );
}

export default Home;
