import React, { useEffect, useState } from "react";
import axios from "axios";
import AddGradeForm from "./AddGradeForm";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showFormFor, setShowFormFor] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    axios.get("http://localhost:3001/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Kļūda ielādējot skolēnus:", err));
  }, []);

  const filtered = students.filter(s =>
    s.first_name.toLowerCase().includes(search.toLowerCase()) ||
    s.last_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">🎓 Skolēnu panelis</h2>

      <input
        className="mb-4 px-4 py-2 border rounded w-full"
        placeholder="Meklēt skolēnu pēc vārda vai uzvārda"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-blue-600 text-red">
            <tr>
              <th className="px-4 py-3">Vārds</th>
              <th className="px-4 py-3">Uzvārds</th>
              <th className="px-4 py-3">Mācību priekšmeti</th>
              <th className="px-4 py-3">Atlikušās dienas</th>
              <th className="px-4 py-3">Vidējā atzīme</th>
              <th className="px-4 py-3">Darbības</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-100 transition">
                <td className="px-4 py-3 font-medium">{s.first_name}</td>
                <td className="px-4 py-3">{s.last_name}</td>
                <td className="px-4 py-3 text-gray-600">Matemātika, Latviešu val., Ģeogrāfija</td>
                <td className="px-4 py-3">{calculateDaysLeft(s)} dienas</td>
                <td className="px-4 py-3 text-yellow-600 font-semibold">{calculateAverage(s)}</td>
                <td className="px-4 py-3">
                  {user?.role === "teacher" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow"
                      onClick={() => setShowFormFor(s.id)}
                    >
                      ➕ Pievienot atzīmi
                    </button>
                  )}
                  {showFormFor === s.id && (
                    <AddGradeForm studentId={s.id} onClose={() => setShowFormFor(null)} />
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Nav atrasts neviens skolēns.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
  return "Nav atzīmju";
}

export default Dashboard;