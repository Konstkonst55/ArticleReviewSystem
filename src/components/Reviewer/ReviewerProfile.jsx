import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function ReviewerProfile() {
  const { reviewerInfo, handleSave, onLogout } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(reviewerInfo);
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const inProgressReviews = JSON.parse(
      localStorage.getItem("inProgressReviews") || "[]"
    ).filter((review) => review.reviewerId === reviewerInfo.id);

    const completedReviews = JSON.parse(
      localStorage.getItem("completedReviews") || "[]"
    ).filter((review) => review.reviewerId === reviewerInfo.id);

    setReviewStats({
      inProgress: inProgressReviews.length,
      completed: completedReviews.length,
      total: inProgressReviews.length + completedReviews.length,
    });
  }, [reviewerInfo.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewers = JSON.parse(localStorage.getItem("reviewers") || "[]");
    const updatedReviewers = reviewers.map((reviewer) =>
      reviewer.id === reviewerInfo.id
        ? { ...reviewer, availableForReviews: formData.availableForReviews }
        : reviewer
    );

    localStorage.setItem("reviewers", JSON.stringify(updatedReviewers));

    handleSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(reviewerInfo);
    setIsEditing(false);
  };

  return (
    <div className="reviewer-profile">
      <div className="profile-section">
        <div className="section-header">
          <h2>Personal Information</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Field of Expertise</label>
              <input
                type="text"
                name="fieldOfExpertise"
                value={formData.fieldOfExpertise}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="availableForReviews"
                  checked={formData.availableForReviews}
                  onChange={handleInputChange}
                />
                Available for new reviews
              </label>
            </div>

            <div className="form-group">
              <label>Maximum concurrent reviews</label>
              <input
                type="number"
                name="maxConcurrentReviews"
                value={formData.maxConcurrentReviews}
                onChange={handleInputChange}
                min="1"
                max="10"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="info-display">
            <div className="info-stats">
              <div className="info-item">
                <label>Full Name</label>
                <div className="info-value">{reviewerInfo.fullName}</div>
              </div>

              <div className="info-item">
                <label>Email</label>
                <div className="info-value">{reviewerInfo.email}</div>
              </div>

              <div className="info-item">
                <label>Institution</label>
                <div className="info-value">{reviewerInfo.institution}</div>
              </div>

              <div className="info-item">
                <label>Field of Expertise</label>
                <div className="info-value">
                  {reviewerInfo.fieldOfExpertise}
                </div>
              </div>
            </div>

            <div className="review-stats">
              <h3>Review Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{reviewStats.total}</div>
                  <div className="stat-label">Total Reviews</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{reviewStats.inProgress}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{reviewStats.completed}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>
            </div>

            <div className="preferences">
              <h3>Review Preferences</h3>
              <div className="preference-item">
                <span>Available for new reviews:</span>
                <span>{reviewerInfo.availableForReviews ? "Yes" : "No"}</span>
              </div>
              <div className="preference-item">
                <span>Maximum concurrent reviews:</span>
                <span>{reviewerInfo.maxConcurrentReviews}</span>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewerProfile;
