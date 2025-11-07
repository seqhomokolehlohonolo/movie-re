import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ user, setUser, toggleSidebar }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Detect scroll to hide hero section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Mini Header */}
      <div className="mini-header">
        <button className="hamburger-btn" onClick={toggleSidebar}>☰</button>
        <Link to="/" className="logo">🎬 CineHub</Link>

        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.elements.search.value.trim();
            if (query) {
              navigate(`/search?query=${encodeURIComponent(query)}`);
              e.target.reset();
            }
          }}
        >
          <input type="text" name="search" placeholder="Search movies..." />
        </form>

        <div className="header-buttons">
          <Link to="/movies" className="btn btn-watch">🎬 Browse Movies</Link>
          {!user && (
            <>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          )}
        </div>
      </div>

      
      
    </>
  );
}

export default Header;
