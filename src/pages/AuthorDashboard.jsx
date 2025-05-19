import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function AuthorDashboard({ onLogout }) {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Machine Learning Advances in 2025",
      author: "Sarah Johnson",
      date: "May 4, 2025",
      category: "Technology",
      status: "Under Review",
    },
    {
      id: 2,
      title: "Blockchain in Healthcare",
      author: "Michael Chen",
      date: "May 3, 2025",
      category: "Healthcare",
      status: "Under Review",
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      author: "Emma Watson",
      date: "May 2, 2025",
      category: "Environment",
      status: "Published",
    },
  ]);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split("/").pop() || "profile"
  );
  const [bio, setBio] = useState(
    "Technology writer with 5+ years of experience in software development and AI."
  );
  const [telegramHandle, setTelegramHandle] = useState("@johndoe");

  const [authorInfo, setAuthorInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    specialization: "Technology",
    location: "New York, USA",
    phone: "",
  });

  const handleSave = (updatedData) => {
    setAuthorInfo(updatedData);
  };

  const handleArticleSubmit = (updatedArticles) => {
    if (Array.isArray(updatedArticles)) {
      setArticles(updatedArticles);
    } else {
      setArticles((prevArticles) => {
        const existingIndex = prevArticles.findIndex(
          (a) => a.id === updatedArticles.id
        );
        if (existingIndex >= 0) {
          const updated = [...prevArticles];
          updated[existingIndex] = updatedArticles;
          return updated;
        }
        return [...prevArticles, updatedArticles];
      });
    }
  };
  return (
    <div className="author-dashboard">
      <div className="author-header">
        <h1>
          {authorInfo.firstName} {authorInfo.lastName}
        </h1>
        <p>{authorInfo.specialization}</p>
      </div>

      <nav className="author-nav">
        <Link
          to="profile"
          className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </Link>
        <Link
          to="submit-article"
          className={`nav-link ${
            activeTab === "submit-article" ? "active" : ""
          }`}
          onClick={() => setActiveTab("submit-article")}
        >
          Submit Article
        </Link>
        <Link
          to="review-articles"
          className={`nav-link ${
            activeTab === "review-articles" ? "active" : ""
          }`}
          onClick={() => setActiveTab("review-articles")}
        >
          Review Articles
        </Link>
      </nav>

      <div className="author-content">
        <Outlet
          context={{
            authorInfo,
            bio,
            setBio,
            telegramHandle,
            setTelegramHandle,
            handleSave,
            onLogout,
            articles,
            onSubmitReview: handleArticleSubmit,
          }}
        />
      </div>
    </div>
  );
}

export default AuthorDashboard;
