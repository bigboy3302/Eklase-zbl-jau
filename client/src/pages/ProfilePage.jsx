import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfilePage({ userId }) {
  const [birthYear, setBirthYear] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${userId}`);
      } catch (err) {
        console.error("Kļūda ielādējot profilu:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      await axios.put(`http://localhost:3001/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("✅ Profils atjaunināts veiksmīgi!");
    } catch (err) {
      console.error("Kļūda saglabājot profilu:", err);
      setMessage("❌ Kļūda saglabājot datus");
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-secondary mb-3">
        🔙 Atpakaļ uz paneli
      </Link>
      <h2>👤 Profils</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Jauna parole:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ievadi jauno paroli"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Augšupielādēt avataru:</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          💾 Saglabāt izmaiņas
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
