import React, { useState } from "react";
import axios from "axios";

export default function AddStudent() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/students/add", {
        first_name: first,
        last_name: last,
        username,
        password,
      });
      alert("Skolēns izveidots!");
      setFirst(""); setLast(""); setUsername(""); setPassword("");
    } catch (err) {
      console.error("❌ Kļūda pievienojot:", err.response?.data);
      alert(err.response?.data?.error || "Nezināma kļūda");
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <input
        placeholder="Vārds"
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        required />
      <input
        placeholder="Uzvārds"
        value={last}
        onChange={(e) => setLast(e.target.value)}
        required />
      <input
        placeholder="Lietotājvārds (login)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required />
      <input
        type="password"
        placeholder="Parole"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required />
      <button type="submit">Pievienot skolēnu</button>
    </form>
  );
}
