import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./scss/app.scss";
import Authorization from "./pages/Authorization";
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";
import AuthorDashboard from "./pages/AuthorDashboard";
import AuthorProfile from "./components/AuthorProfile";
import AuthorMyArticles from "./components/AuthorMyArticles";
import AuthorSubmitArticle from "./components/AuthorSubmitArticle";
import AuthorReviewArticles from "./components/AuthorReviewArticles";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const navigate = useNavigate();

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/author-dashboard");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      setIsAuthenticated(true);
      const role = localStorage.getItem("userRole");
      if (role) setUserRole(role);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Authorization onLogin={handleLogin} />} />
      <Route path="/registration" element={<Registration />} />

      <Route
        path="/admin-dashboard"
        element={
          isAuthenticated && userRole === "admin" ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/author-dashboard"
        element={
          isAuthenticated && userRole === "author" ? (
            <AuthorDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="profile" element={<AuthorProfile />} />
        <Route path="my-articles" element={<AuthorMyArticles />} />
        <Route path="submit-article" element={<AuthorSubmitArticle />} />
        <Route path="review-articles" element={<AuthorReviewArticles />} />
        <Route index element={<Navigate to="profile" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
