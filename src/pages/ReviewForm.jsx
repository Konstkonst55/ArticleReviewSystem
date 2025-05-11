// src/pages/ReviewForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewForm = ({ articleId }) => {
  const [reviewData, setReviewData] = useState({
    comment: "",
    status: "needs revision",
  });

  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch article data if ID is provided
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${articleId}`);
        setArticle(res.data);
      } catch (err) {
        setError("Failed to load article information.");
      }
    };
    if (articleId) fetchArticle();
  }, [articleId]);

  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${articleId}`, reviewData);
      setSuccess("Review successfully submitted!");
      setError("");
    } catch (err) {
      setError("Error submitting the review.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Create Review</h2>

      {article && <h3>Article: {article.title}</h3>}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Article Status:</label>
          <select name="status" value={reviewData.status} onChange={handleChange}>
            <option value="needs revision">Needs Revision</option>
            <option value="accepted for publication">Accepted for Publication</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label>Comment:</label>
          <textarea
            name="comment"
            rows="6"
            value={reviewData.comment}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;