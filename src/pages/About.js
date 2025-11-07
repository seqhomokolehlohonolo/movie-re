import { useEffect, useState } from "react";
import API from "../api";
import MovieCard from "../components/MovieCard";
import "./About.css";

export default function About() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/movies");
        // Simple trending filter: rating >=4
        const trendingMovies = res.data.filter((m) => m.rating >= 4);
        setTrending(trendingMovies);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="about-container">
      {/* Hero Banner */}
      <div
        className="about-hero"
        style={{
          backgroundImage: `url("https://via.placeholder.com/1200x400?text=Movie+Review+Platform")`,
        }}
      >
        <div className="hero-overlay">
          <h1>About MovieReview</h1>
        </div>
      </div>

      {/* About Text */}
      <div className="about-box">
        <p>
          MovieReview is a platform where movie enthusiasts can <strong>review movies</strong>, <strong>rate them</strong>, and <strong>see what others think</strong>.
          Explore popular films, trending releases, and discover hidden gems based on community ratings and reviews. Share your opinion,
          check out what fellow viewers think, and stay updated with the latest releases—all in one place.
        </p>
      </div>

      {/* Trending Movies Row */}
      {trending.length > 0 && (
        <div className="section trending-section">
          <h2>🔥 Trending Movies</h2>
          <div className="trending-row">
            {trending.map((movie) => (
              <MovieCard key={movie.id || movie.title} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


