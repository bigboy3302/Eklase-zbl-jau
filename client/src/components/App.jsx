import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AddStudent from "./pages/AddStudent";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  if (!role) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm onLogin={(r) => {
            setRole(r);
            localStorage.setItem("role", r);
          }} />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="container mt-3">
        <nav>
          <Link to="/" className="btn btn-secondary me-2">Sākums</Link>
          {role === "teacher" && (
            <Link to="/add-student" className="btn btn-primary me-2">Pievienot skolēnu</Link>
          )}
          <button className="btn btn-danger" onClick={() => {
            setRole(null);
            localStorage.clear();
          }}>Iziet</button>
        </nav>

        <Routes>
          <Route path="/" element={<h2>Sveicināts, {role}!</h2>} />
          {role === "teacher" && <Route path="/add-student" element={<AddStudent />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
