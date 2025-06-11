import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Kļūda ielādējot skolēnus:", err));
  }, []);

  return (
    <div>
      <h2>Skolēnu panelis</h2>
      <table>
        <thead>
          <tr>
            <th>Vārds</th>
            <th>Uzvārds</th>
            <th>Mācību priekšmeti</th>
            <th>Atlikušās dienas</th>
            <th>Vidējā atzīme</th>
            <th>Darbības</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.first_name}</td>
              <td>{s.last_name}</td>
              <td>Matemātika, Latviešu val., Ģeogrāfija</td>
              <td>{calculateDaysLeft(s)} dienas</td>
              <td>{calculateAverage(s)}</td>
              <td><button>Pievienot atzīmi</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function calculateDaysLeft(student) {
  const endDate = new Date("2025-06-30");
  const today = new Date();
  const diff = endDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calculateAverage(student) {
  // Šeit pagaidām nav datu, tāpēc atgriežam 0 vai piemēru
  return "Nav atzīmju";
}

export default Dashboard;
