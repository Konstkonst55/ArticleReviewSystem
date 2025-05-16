import React, { useState, useEffect } from "react";

const ReviewSubmission = () => {
  const [formData, setFormData] = useState({
    overallRating: 0,
    recommendation: "",
    technicalMerit: "",
    originality: "",
    presentationQuality: "",
    commentsToAuthors: "",
    confidentialComments: "",
    attachments: [],
  });

  const [progress, setProgress] = useState(0);

  // Рассчитываем прогресс заполнения формы
  useEffect(() => {
    let filledFields = 0;
    const totalFields = 7; // Общее количество полей для заполнения

    if (formData.overallRating > 0) filledFields++;
    if (formData.recommendation) filledFields++;
    if (formData.technicalMerit) filledFields++;
    if (formData.originality) filledFields++;
    if (formData.presentationQuality) filledFields++;
    if (formData.commentsToAuthors) filledFields++;
    if (formData.confidentialComments) filledFields++;

    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Отправка данных рецензии
    console.log("Review submitted:", formData);
  };

  const handleSaveDraft = () => {
    // Сохранение черновика
    console.log("Draft saved:", formData);
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
            <h3>Machine Learning Applications in Healthcare</h3>
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
                <option value="Accept">Accept</option>
                <option value="Accept with minor revisions">
                  Accept with minor revisions
                </option>
                <option value="Accept with major revisions">
                  Accept with major revisions
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
              />
              <label htmlFor="file-upload" className="upload-area">
                <p>Drag and drop files here or click to upload</p>
              </label>
              <div className="file-list">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="file-item">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="review-actions">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="save-draft"
            >
              Save Draft
            </button>
            <button type="submit" className="submit-review">
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
