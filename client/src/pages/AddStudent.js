import React, { useState } from 'react';
import axios from 'axios';

function AddStudent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/students/add", {
        first_name: firstName,
        last_name: lastName,
      });
      setMessage(res.data.message);
      setFirstName('');
      setLastName('');
    } catch (err) {
      setMessage("Kļūda: " + (err.response?.data?.message || "Nezināma"));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pievienot skolēnu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Vārds</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Uzvārds</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Pievienot</button>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </form>
    </div>
  );
}

export default AddStudent;
