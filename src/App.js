import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import AddReview from "./pages/AddReview";
import MyReviews from "./pages/MyReviews";
import About from "./pages/About";
import MovieDetails from "./pages/MovieDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Check if user is stored in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <Header toggleSidebar={toggleSidebar} user={user} />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        setUser={setUser} // ✅ pass setUser here correctly
      />

      <div style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "0.3s" }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails user={user} />} />

          {/* ✅ Pass user to AddReview so it knows who is logged in */}
          <Route path="/add-review" element={<AddReview user={user} />} />

          <Route path="/my-reviews" element={<MyReviews user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
