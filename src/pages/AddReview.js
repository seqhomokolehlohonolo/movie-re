import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AddReview.css";

export default function AddReview({ user }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const moviesRes = await axios.get("http://localhost:5000/api/movies");
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${user.id}`);

        const unratedMovies = moviesRes.data.filter(
          (movie) => !reviewsRes.data.some((rev) => rev.movieId === movie.id)
        );

        setMovies(unratedMovies);
        if (unratedMovies.length > 0) setSelectedMovie(unratedMovies[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies.");
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in to add a review.");
    if (!selectedMovie || !rating || !comment) return setError("Complete all fields.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/reviews", {
        movieId: selectedMovie.id,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
      });

      setSuccess("Review added successfully!");
      setRating(0);
      setComment("");

      setMovies((prev) => prev.filter((m) => m.id !== selectedMovie.id));
      setSelectedMovie((prev) => (movies.length > 1 ? movies[1] : null));
    } catch (err) {
      console.error(err);
      setError("Failed to add review.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="login-warning">Please login to add a review.</p>;

  return (
    <div className="add-review-container">
      <h2 className="add-review-title">✍️ Add a Movie Review</h2>

      {movies.length === 0 ? (
        <p className="no-movies-msg">🎉 You have already reviewed all movies!</p>
      ) : (
        <>
          <div className="movie-cards">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={`movie-card ${selectedMovie?.id === movie.id ? "selected" : ""}`}
              >
                <Link to={`/movies/${movie.id}`} className="movie-link">
                  <img src={movie.poster} alt={movie.title} />
                  <div className="movie-info">
                    <h4>{movie.title}</h4>
                    <p>{movie.genre} | {movie.year}</p>
                  </div>
                </Link>
                <button
                  className="select-btn"
                  onClick={() => setSelectedMovie(movie)}
                >
                  {selectedMovie?.id === movie.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>

          {selectedMovie && (
            <form onSubmit={handleSubmit} className="add-review-form">
              <h3>Reviewing: {selectedMovie.title}</h3>

              <div className="form-group">
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Write your review here..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>

              {success && <p className="success-msg">{success}</p>}
              {error && <p className="error-msg">{error}</p>}
            </form>
          )}
        </>
      )}
    </div>
  );
}
