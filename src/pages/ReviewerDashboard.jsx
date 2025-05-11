// src/pages/ReviewerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewerDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("needs revision");
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // Load active and completed reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const pendingRes = await axios.get("/api/reviews/pending");
        const completedRes = await axios.get("/api/reviews/completed");
        setPendingReviews(pendingRes.data);
        setCompletedReviews(completedRes.data);
      } catch (err) {
        console.error("Error fetching reviews");
      }
    };
    fetchReviews();
  }, []);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${selectedArticleId}`, {
        comment: reviewText,
        status: reviewStatus,
      });
      alert("Review successfully submitted!");
      window.location.reload();
    } catch (err) {
      console.error("Error submitting review");
    }
  };

  return (
    <div>
      <h2>Reviewer Dashboard</h2>

      <section>
        <h3>Pending Reviews</h3>
        {pendingReviews.length > 0 ? (
          <ul>
            {pendingReviews.map((review) => (
              <li key={review.articleId}>
                <strong>{review.title}</strong>
                <button onClick={() => setSelectedArticleId(review.articleId)}>
                  Write Review
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No active assignments.</p>
        )}
      </section>

      {selectedArticleId && (
        <section>
          <h3>Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
            >
              <option value="needs revision">Needs Revision</option>
              <option value="accepted for publication">Accepted for Publication</option>
              <option value="rejected">Rejected</option>
            </select>
            <br />
            <textarea
              placeholder="Reviewer's Comment"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
            <br />
            <button type="submit">Submit Review</button>
          </form>
        </section>
      )}

      <section>
        <h3>Review History</h3>
        {completedReviews.length > 0 ? (
          <ul>
            {completedReviews.map((review) => (
              <li key={review.id}>
                <strong>{review.title}</strong> - Status: {review.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not written any reviews yet.</p>
        )}
      </section>
    </div>
  );
};

export default ReviewerDashboard;