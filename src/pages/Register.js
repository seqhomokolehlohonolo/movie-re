import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // ← import the CSS file

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/register", form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay">
        <div className="register-card">
          <h2 className="register-title">Create an Account</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
          <p className="register-footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
