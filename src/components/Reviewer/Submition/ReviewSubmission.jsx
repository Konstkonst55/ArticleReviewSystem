import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewSubmission = () => {
  const location = useLocation();
  const articleData = location.state?.articleData || {
    title: "Machine Learning Applications in Healthcare",
    authors: "Sarah Johnson, Michael Chen",
  };
  const [formData, setFormData] = useState({
    overallRating: 0,
    recommendation: "",
    technicalMerit: "",
    originality: "",
    presentationQuality: "",
    commentsToAuthors: "",
    confidentialComments: "",
    attachments: [],
    title: articleData.title,
    authors: articleData.authors,
  });

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let filledFields = 0;
    const totalFields = 7;

    if (formData.overallRating > 0) filledFields++;
    if (formData.recommendation) filledFields++;
    if (formData.technicalMerit) filledFields++;
    if (formData.originality) filledFields++;
    if (formData.presentationQuality) filledFields++;
    if (formData.commentsToAuthors) filledFields++;
    if (formData.confidentialComments) filledFields++;

    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
    setIsComplete(newProgress === 100);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, overallRating: rating }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isComplete) {
      alert("Please fill in all required fields before submitting the review.");
      return;
    }

    const completedReviews = JSON.parse(
      localStorage.getItem("completedReviews") || "[]"
    );

    const newReview = {
      id: Date.now(),
      title: formData.title,
      authors: formData.authors,
      completedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      score: formData.overallRating,
      decision: formData.recommendation,
    };

    localStorage.setItem(
      "completedReviews",
      JSON.stringify([...completedReviews, newReview])
    );

    const inProgressReviews = JSON.parse(
      localStorage.getItem("inProgressReviews") || "[]"
    );
    const updatedInProgress = inProgressReviews.filter(
      (r) => r.title !== formData.title
    );
    localStorage.setItem(
      "inProgressReviews",
      JSON.stringify(updatedInProgress)
    );

    navigate("/reviewer-dashboard/completed");
  };

  const handleSaveDraft = () => {
    if (isComplete) {
      alert("All fields are complete. Please use 'Submit Review' instead.");
      return;
    }

    const inProgressReviews = JSON.parse(
      localStorage.getItem("inProgressReviews") || "[]"
    );

    const existingIndex = inProgressReviews.findIndex(
      (r) => r.title === formData.title
    );

    if (existingIndex >= 0) {
      inProgressReviews[existingIndex] = {
        ...inProgressReviews[existingIndex],
        progress: progress,
      };
    } else {
      inProgressReviews.push({
        id: Date.now(),
        title: formData.title,
        authors: formData.authors,
        progress: progress,
        dueDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      });
    }

    localStorage.setItem(
      "inProgressReviews",
      JSON.stringify(inProgressReviews)
    );
    navigate("/reviewer-dashboard/in-progress");
  };

  return (
    <div className="review-system">
      <div className="review-header">
        <h1>Review System</h1>
      </div>

      <div className="review-container">
        <div className="review-progress">
          <h3>Review Progress: {progress}%</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="review-section">
            <h2>Review Submission</h2>
            <h3>{formData.title || "Review"}</h3>
            <p className="authors">Authors: {formData.authors}</p>
          </div>

          <div className="review-section">
            <h2>Review Summary</h2>
            <div className="form-group">
              <label>Overall Rating</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${
                      star <= formData.overallRating ? "filled" : ""
                    }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Recommendation</label>
              <select
                name="recommendation"
                value={formData.recommendation}
                onChange={handleInputChange}
              >
                <option value="">Select recommendation</option>
                <option value="Accept">Accept as is</option>
                <option value="Accept with minor revisions">
                  Accept with minor revisions
                </option>
                <option value="Accept with major revisions">
                  Major Revission Required
                </option>
                <option value="Reject">Reject</option>
              </select>
            </div>
          </div>

          <div className="review-section">
            <h2>Detailed Review</h2>

            <div className="form-group">
              <label>Technical Merit</label>
              <textarea
                name="technicalMerit"
                value={formData.technicalMerit}
                onChange={handleInputChange}
                placeholder="Evaluate the technical quality of the research..."
              />
            </div>

            <div className="form-group">
              <label>Originality</label>
              <textarea
                name="originality"
                value={formData.originality}
                onChange={handleInputChange}
                placeholder="Assess the novelty and originality of the work..."
              />
            </div>

            <div className="form-group">
              <label>Presentation Quality</label>
              <textarea
                name="presentationQuality"
                value={formData.presentationQuality}
                onChange={handleInputChange}
                placeholder="Comment on the clarity and organization..."
              />
            </div>
          </div>

          <div className="review-section">
            <h2>Additional Comments</h2>

            <div className="form-group">
              <label>Comments to Authors</label>
              <textarea
                name="commentsToAuthors"
                value={formData.commentsToAuthors}
                onChange={handleInputChange}
                placeholder="Provide constructive feedback..."
              />
            </div>

            <div className="form-group">
              <label>Confidential Comments to Editor</label>
              <textarea
                name="confidentialComments"
                value={formData.confidentialComments}
                onChange={handleInputChange}
                placeholder="Private comments for the editor..."
              />
            </div>
          </div>

          <div className="review-section">
            <h2>Attachments</h2>
            <div className="file-upload">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                multiple
                style={{ display: "none" }}
                accept=".pdf,.docx"
              />
              <label
                htmlFor="file-upload"
                className={`upload-area ${
                  formData.attachments.length > 0 ? "has-files" : ""
                }`}
              >
                <div className="upload-content">
                  <p>Drag and drop file here or</p>
                  <button className="browse-text">Browse files</button>
                  <p className="file-formats">
                    Supported formats: PDF, DOCX (required for review)
                  </p>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="file-list">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="review-actions">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="save-draft"
              disabled={isComplete}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="submit-review"
              disabled={!isComplete}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>

      <footer className="review-footer">
        <p>© 2025 Review System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ReviewSubmission;
