import React, { useState } from "react";
import axios from "axios";

function AddGradeForm({ studentId, onClose, onGradeAdded }) {
  const [subject, setSubject] = useState("latviesu valoda");
  const [grade, setGrade] = useState(1);

  const subjects = [
    "latviesu valoda",
    "anglu valoda",
    "matematika",
    "sports",
    "programmesana",
    "eikt",
    "uznemej darbiba",
    "bialogija",
    "fizika"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/grade/add", {
        student_id: studentId,
        subject,
        grade: parseInt(grade)
      });
      if (onGradeAdded) onGradeAdded();
      onClose();
    } catch (err) {
      alert("Kļūda pievienojot atzīmi");
      console.error("Kļūda:", err);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={headerStyle}>➕ Pievienot atzīmi</h3>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label>Priekšmets:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
            {subjects.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          <label>Atzīme (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />

          <div style={buttonContainerStyle}>
            <button type="submit" style={saveBtn}>💾 Saglabāt</button>
            <button type="button" onClick={onClose} style={cancelBtn}>❌ Atcelt</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGradeForm;

// Inline stils:
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  width: "320px",
  maxWidth: "95%"
};

const headerStyle = {
  marginBottom: "15px",
  textAlign: "center"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px"
};

const saveBtn = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};

const cancelBtn = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};
