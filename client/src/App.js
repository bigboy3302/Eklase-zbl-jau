import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AddStudent from "./pages/AddStudent";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage"; // <-- jau ir importēts

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <div className="container mt-3">
        <nav>
          {!user ? (
            <>
              <Link to="/" className="btn btn-secondary me-2">Login</Link>
              <Link to="/register" className="btn btn-secondary me-2">Reģistrēties</Link>
            </>
          ) : (
            <>
              <span className="me-2">Lietotājs: {user.role}</span>
              <Link to="/dashboard" className="btn btn-secondary me-2">Panelis</Link>
              <Link to="/profile" className="btn btn-secondary me-2">Profils</Link>
              {user.role === "teacher" && (
                <Link to="/add-student" className="btn btn-primary me-2">Pievienot skolēnu</Link>
              )}
              <button className="btn btn-danger" onClick={handleLogout}>Izrakstīties</button>
            </>
          )}
        </nav>

        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LoginForm setUser={setUser} />} />
              <Route path="/register" element={<RegisterForm />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/profile" element={<ProfilePage userId={user.id} />} />
              {user.role === "teacher" && (
                <Route path="/add-student" element={<AddStudent />} />
              )}
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
