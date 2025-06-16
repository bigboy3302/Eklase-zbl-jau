import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      const user = {
        token: res.data.token,
        role: res.data.user.role,
        username: res.data.user.username,
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Kļūda pieslēdzoties");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={login}>
        <h2>Pieslēgties</h2>

        {error && <div className="error-message">{error}</div>}

        <input
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

        <button type="submit">Pieslēgties</button>

        <p>Nav konta? <a href="/register">Reģistrēties</a></p>
      </form>
    </div>
  );
}

export default LoginForm;
