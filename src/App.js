import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./scss/app.scss";
import Authorization from "./pages/Authorization";
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Authorization onLogin={handleLogin} />} />
      <Route path="/registration" element={<Registration />} />
      <Route
        path="/admin-dashboard"
        element={
          isAuthenticated ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
