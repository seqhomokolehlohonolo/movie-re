import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie, hoverPreview }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`card h-100 shadow-sm movie-card ${hoverPreview ? "hoverable" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: "10px", transition: "transform 0.3s" }}
    >
      <Link to={`/movies/${movie.id}`}>
        <img
          src={movie.poster || "https://via.placeholder.com/200x300?text=No+Poster"}
          alt={movie.title}
          className="card-img-top"
          style={{ height: "300px", objectFit: "cover", width: "100%", display: "block" }}
        />
        {hover && hoverPreview && (
          <div
            className="hover-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))",
              color: "#fff",
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              transition: "opacity 0.3s",
            }}
          >
            <h5 style={{ marginBottom: "5px" }}>{movie.title}</h5>
            <p style={{ marginBottom: "5px" }}>⭐ {movie.averageRating?.toFixed(1) || "No rating yet"}</p>
            <p className="hover-description" style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
              {movie.description}
            </p>
          </div>
        )}
      </Link>
    </div>
  );
}

export default MovieCard;
