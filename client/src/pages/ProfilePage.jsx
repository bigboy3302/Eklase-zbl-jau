import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage({ userId }) {
  const [password, setPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3001/profile/${userId}`)
      .then(res => {
        setBirthYear(res.data.birth_year || "");
        setAvatarUrl(res.data.avatar || "");
      })
      .catch(err => console.error("Kļūda ielādējot profilu:", err));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3001/profile/${userId}`, {
        password,
        birth_year: birthYear,
        avatar_url: avatarUrl,
      });

      alert("✅ Profils saglabāts!");
      setPassword("");
    } catch (err) {
      console.error("❌ Kļūda saglabājot profilu:", err);
      alert("Neizdevās saglabāt");
    }
  };

  return (
    <div className="container mt-4">
      <h2>👤 Profils</h2>

      <div className="mb-3">
        <img
          src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt="Avatar"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Dzimšanas gads:</label>
          <input
            type="number"
            className="form-control"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Jauna parole:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Profila attēla saite (URL):</label>
          <input
            type="text"
            className="form-control"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <button type="submit" className="btn btn-primary">💾 Saglabāt</button>
      </form>
    </div>
  );
}

export default ProfilePage;
