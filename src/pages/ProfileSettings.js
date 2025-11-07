import React, { useState, useEffect } from "react";
import API from "../api";
import "./ProfileSettings.css";

function ProfileSettings() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch logged-in user's profile info
    API.get("/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put("/profile", profile);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-overlay">
        <div className="profile-card">
          <h2 className="profile-title">Edit Profile</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSave}>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;