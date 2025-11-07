import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./MovieDetails.css";

function MovieDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    API.get("/movies")
      .then((res) => setMovie(res.data.find((m) => m.id === id)))
      .catch(console.error);

    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to submit a review");
    if (!newReview.comment || !newReview.rating) return;

    try {
      if (editingReviewId) {
        await API.put(`/reviews/${editingReviewId}`, { ...newReview });
        setEditingReviewId(null);
      } else {
        await API.post("/reviews", {
          movieId: id,
          userId: user.id,
          userName: user.name,
          comment: newReview.comment,
          rating: newReview.rating,
        });
      }
      setNewReview({ comment: "", rating: 0 });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (rev) => {
    setEditingReviewId(rev.id);
    setNewReview({ comment: rev.comment, rating: rev.rating });
  };

  const handleDelete = async (revId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/reviews/${revId}`);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (!movie) return <p className="text-muted">Loading movie details...</p>;

  return (
    <div className="movie-details-page container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Hero Section */}
      <div className="movie-hero-section">
        <img
          src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-hero-info">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-meta">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre} | {movie.year}</p>
          <p className="movie-rating">⭐ {movie.averageRating?.toFixed(1) || "N/A"}</p>
          <div className="hero-buttons">
            <button className="btn btn-watch">▶ Watch Now</button>
            <button className="btn btn-watchlist">+ Watchlist</button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="movie-description card shadow p-4 mt-4">
        <h3>Description</h3>
        <p>{movie.description || "No description available."}</p>
      </div>

      {/* Reviews */}
      <div className="reviews-section mt-5">
        <h3>⭐ Reviews</h3>
        <div className="reviews-grid">
          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="review-card card p-3 mb-3 shadow-sm d-flex align-items-start">
                  <div className="review-avatar">{rev.userName[0]}</div>
                  <div className="review-content ms-3 flex-grow-1">
                    <p className="review-user mb-1"><strong>{rev.userName}</strong> – ⭐ {rev.rating}</p>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                  {user && rev.userId === user.id && (
                    <div className="review-actions ms-3">
                      <button className="btn btn-edit me-2" onClick={() => handleEdit(rev)}>Edit</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(rev.id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>

          {/* Add/Edit Review */}
          {user && (
            <div className="review-form-container">
              <form onSubmit={handleSubmit} className="review-form card p-3 shadow-sm">
                <h5>{editingReviewId ? "Edit Your Review" : "📝 Write a Review"}</h5>
                <textarea
                  placeholder="Your review"
                  className="form-control mb-2"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Rating (1-5)"
                  className="form-control mb-2"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  required
                />
                <button className="btn btn-warning">{editingReviewId ? "Update Review" : "Submit Review"}</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
