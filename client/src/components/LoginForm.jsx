import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      const user = { token: res.data.token, role: res.data.role };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Kļūda pieslēdzoties");
    }
  };

  return (
    <form onSubmit={login}>
      <h2>Pieslēgties</h2>
      <input
        placeholder="Lietotājvārds"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Parole"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Pieslēgties</button>
    </form>
  );
}

export default LoginForm;
