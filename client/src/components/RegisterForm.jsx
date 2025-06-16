import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      setSuccess("Reģistrācija veiksmīga!");
      setError("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("Kļūda reģistrējot lietotāju.");
      setSuccess("");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={register}>
        <h2>Reģistrācija</h2>

        <input
          type="text"
          placeholder="Lietotājvārds"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parole"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reģistrēties</button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <p>Jau ir konts? <a href="/login">Pieslēgties</a></p>
      </form>
    </div>
  );
}

export default RegisterForm;
