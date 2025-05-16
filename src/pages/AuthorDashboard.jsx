import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function AuthorDashboard({ onLogout }) {
  const [submittedArticles, setSubmittedArticles] = useState([]);
  const handleArticleSubmit = (article) => {
    setSubmittedArticles((prev) => [...prev, article]);
  };
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
    console.log("Saved:", updatedData);
    setAuthorInfo(updatedData);
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
            onSubmitReview: handleArticleSubmit,
          }}
        />
      </div>
    </div>
  );
}

export default AuthorDashboard;
