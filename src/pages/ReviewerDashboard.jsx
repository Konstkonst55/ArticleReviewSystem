import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function ReviewerDashboard({ onLogout }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split("/").pop() || "profile"
  );

  const [reviewerInfo, setReviewerInfo] = useState({
    fullName: "John Smith",
    email: "john.smith@university.edu",
    institution: "University of Science",
    fieldOfExpertise: "Computer Science",
    availableForReviews: true,
    maxConcurrentReviews: 3,
  });

  const handleSave = (updatedData) => {
    setReviewerInfo(updatedData);
  };

  return (
    <div className="reviewer-dashboard">
      <div className="reviewer-header">
        <h1>{reviewerInfo.fullName}</h1>
        <p>Reviewer Dashboard</p>
      </div>

      <nav className="reviewer-nav">
        <Link
          to="profile"
          className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </Link>
        <Link
          to="in-progress"
          className={`nav-link ${activeTab === "in-progress" ? "active" : ""}`}
          onClick={() => setActiveTab("in-progress")}
        >
          In Progress Reviews
        </Link>
        <Link
          to="completed"
          className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Reviews
        </Link>
      </nav>

      <div className="reviewer-content">
        <Outlet
          context={{
            reviewerInfo,
            handleSave,
            onLogout,
          }}
        />
      </div>
    </div>
  );
}

export default ReviewerDashboard;
