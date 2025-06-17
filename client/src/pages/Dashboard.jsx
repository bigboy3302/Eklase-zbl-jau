import React, { useState, useEffect } from "react";
import axios from "axios";

const AddGradeForm = ({ studentId, onClose, onGradeAdded }) => {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/students/${studentId}/grades`, { subject, grade });
      onGradeAdded();
      onClose();
    } catch (err) {
      alert("Kļūda pievienojot atzīmi: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
      <input
        placeholder="Priekšmets"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <input
        placeholder="Atzīme"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        required
      />
      <button type="submit">Pievienot atzīmi</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
        Atcelt
      </button>
    </form>
  );
};

const EditModal = ({ student, onClose, onSave }) => {
  const [firstName, setFirstName] = useState(student.first_name);
  const [lastName, setLastName] = useState(student.last_name);
  const [avatarUrl, setAvatarUrl] = useState(student.avatar_url || "");

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/students/${student.id}`, {
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
      });
      onSave();
      onClose();
    } catch (err) {
      alert("Kļūda saglabājot skolēnu: " + err.message);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h3>Rediģēt skolnieku</h3>
        <input
          placeholder="Vārds"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="Uzvārds"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="Profila bilde URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button onClick={handleSave} style={{ marginRight: 8 }}>Saglabāt</button>
        <button onClick={onClose}>Atcelt</button>
      </div>
    </div>
  );
};

export default function Dashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [showFormFor, setShowFormFor] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:3001/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Kļūda ielādējot skolēnus:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tiešām dzēst šo skolēnu?")) return;
    try {
      await axios.delete(`http://localhost:3001/students/${id}`);
      alert("Skolēns dzēsts");
      fetchStudents();
    } catch (err) {
      alert("Kļūda dzēšot skolēnu: " + err.message);
    }
  };

  const startEdit = (student) => {
    setEditingStudent(student);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingStudent(null);
  };

  const onGradeAdded = () => {
    fetchStudents();
  };

  const calculateAverage = (grades) => {
    if (!grades || grades.length === 0) return "-";
    const sum = grades.reduce((acc, g) => acc + Number(g.grade), 0);
    return (sum / grades.length).toFixed(2);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Skolēnu saraksts</h1>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", maxWidth: 700 }}>
        <thead>
          <tr>
            <th>Profila bilde</th>
            <th>Vārds Uzvārds</th>
            <th>Vidējā atzīme</th>
            <th>Darbības</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>
                {student.avatar_url ? (
                  <img src={student.avatar_url} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#ccc" }} />
                )}
              </td>
              <td>{student.first_name} {student.last_name}</td>
              <td>{calculateAverage(student.grades || [])}</td>
              <td>
                <button onClick={() => startEdit(student)}>Rediģēt</button>{" "}
                <button onClick={() => handleDelete(student.id)}>Dzēst</button>{" "}
                <button onClick={() => setShowFormFor(student.id)}>Pievienot atzīmi</button>
                {showFormFor === student.id && (
                  <AddGradeForm
                    studentId={student.id}
                    onClose={() => setShowFormFor(null)}
                    onGradeAdded={onGradeAdded}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalOpen && editingStudent && (
        <EditModal
          student={editingStudent}
          onClose={closeEditModal}
          onSave={() => {
            fetchStudents();
            closeEditModal();
          }}
        />
      )}
    </div>
  );
}
