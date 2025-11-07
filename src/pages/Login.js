import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/login", form);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google Login not implemented yet!");
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-card fade-in">

          <h2 className="login-title">🎬 MovieReview Login</h2>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              required
              className="fade-in"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              required
              className="fade-in"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Login"}
            </button>
          </form>

          <div className="divider">or</div>
          <button className="google-btn" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
