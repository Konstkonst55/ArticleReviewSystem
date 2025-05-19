import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./scss/app.scss";
import Authorization from "./pages/Authorization";
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";
import AuthorDashboard from "./pages/AuthorDashboard";
import AuthorProfile from "./components/Author/AuthorProfile";
import AuthorSubmitArticle from "./components/Author/AuthorSubmitArticle";
import AuthorReviewArticles from "./components/Author/AuthorReviewArticles";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewerProfile from "./components/Reviewer/ReviewerProfile";
import InProgressReviews from "./components/Reviewer/InProgressReviews";
import CompletedReviews from "./components/Reviewer/CompletedReviews";
import ReviewSubmission from "./components/Reviewer/Submition/ReviewSubmission";

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

    if (role === "Administrator") {
      navigate("/admin-dashboard");
    } else if (role === "Author") {
      navigate("/author-dashboard");
    } else if (role === "Reviewer") {
      navigate("/reviewer-dashboard");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authExpires");
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
          isAuthenticated && userRole === "Administrator" ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/author-dashboard"
        element={
          isAuthenticated && userRole === "Author" ? (
            <AuthorDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="profile" element={<AuthorProfile />} />
        <Route path="submit-article" element={<AuthorSubmitArticle />} />
        <Route path="review-articles" element={<AuthorReviewArticles />} />
        <Route index element={<Navigate to="profile" replace />} />
      </Route>

      <Route
        path="/reviewer-dashboard"
        element={
          isAuthenticated && userRole === "Reviewer" ? (
            <ReviewerDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="profile" element={<ReviewerProfile />} />
        <Route path="in-progress" element={<InProgressReviews />} />
        <Route path="completed" element={<CompletedReviews />} />
        <Route index element={<Navigate to="profile" replace />} />
      </Route>
      <Route
        path="/review-submission"
        element={
          isAuthenticated && userRole === "Reviewer" ? (
            <ReviewSubmission />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
