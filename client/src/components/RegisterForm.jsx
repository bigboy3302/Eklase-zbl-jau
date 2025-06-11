import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("teacher");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending data to backend:", { username, password, code, role });

      const response = await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
        role,
        code,
      });

      console.log("Backend response:", response.data);

      alert("Reģistrācija veiksmīga!");
      navigate("/");
    } catch (err) {
      console.error("Reģistrācijas kļūda:", err);
      alert(err.response?.data?.error || "Kļūda reģistrējoties");
    }
  };

  return (
    <form onSubmit={register}>
      <h2>Reģistrācija</h2>

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

      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="teacher">Skolotājs</option>
        <option value="admin">Administrators</option>
      </select>

      <input
        placeholder="Reģistrācijas kods"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <button type="submit">Reģistrēties</button>
    </form>
  );
}

export default RegisterForm;
