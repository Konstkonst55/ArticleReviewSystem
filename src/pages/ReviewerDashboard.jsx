import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  getReviewerProfile,
  updateReviewerProfile,
  getInProgressAssignments,
  getCompletedReviews,
  respondToAssignment,
  createReview,
} from "../api";

function ReviewerDashboard({ onLogout }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split("/").pop() || "profile"
  );
  const [reviewerInfo, setReviewerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getReviewerProfile()
      .then(({ data }) => {
        setReviewerInfo(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updatedData) => {
    updateReviewerProfile(updatedData)
      .then(({ data }) => {
        setReviewerInfo(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update profile.");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="reviewer-dashboard">
      <div className="reviewer-header">
        <h1>{reviewerInfo.fullName}</h1>
        <p>Reviewer Dashboard</p>
      </div>

      <nav className="reviewer-nav">
        {[
          { key: "profile", label: "Profile" },
          { key: "in-progress", label: "In Progress Reviews" },
          { key: "completed", label: "Completed Reviews" },
        ].map((tab) => (
          <Link
            key={tab.key}
            to={tab.key}
            className={`nav-link ${activeTab === tab.key ? "active" : ""
              }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="reviewer-content">
        <Outlet
          context={{
            reviewerInfo,
            handleSave,
            getInProgressAssignments,
            getCompletedReviews,
            respondToAssignment,
            createReview,
            onLogout,
          }}
        />
      </div>
    </div>
  );
}

export default ReviewerDashboard;
