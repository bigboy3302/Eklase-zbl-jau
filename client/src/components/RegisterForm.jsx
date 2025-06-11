import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
        role,
        code: role === "teacher" ? code : undefined
      });
      alert("Reģistrācija veiksmīga!");
      navigate("/"); // Uz login
    } catch (err) {
      alert(err.response?.data?.error || "Kļūda");
    }
  };

  return (
    <form onSubmit={register}>
      <h2>Reģistrācija</h2>
      <input placeholder="Lietotājvārds" onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Parole" onChange={(e) => setPassword(e.target.value)} required />
      <select onChange={(e) => setRole(e.target.value)} value={role}>
        <option value="student">Skolēns</option>
        <option value="teacher">Skolotājs</option>
      </select>
      {role === "teacher" && (
        <input placeholder="Reģistrācijas kods" onChange={(e) => setCode(e.target.value)} />
      )}
      <button type="submit">Reģistrēties</button>
    </form>
  );
}

export default RegisterForm;
