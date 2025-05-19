import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function InProgressReviews() {
  const {
    getInProgressAssignments,
    respondToAssignment,
  } = useOutletContext();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getInProgressAssignments()
      .then(({ data }) => {
        setAssignments(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load assignments.");
      })
      .finally(() => setLoading(false));
  }, [getInProgressAssignments]);

  const newRequests = assignments.filter((a) => a.isAccepted === null);
  const inProgress = assignments.filter((a) => a.isAccepted === true);

  const handleRespond = (assignmentId, accept) => {
    respondToAssignment(assignmentId, accept)
      .then(({ data }) => {
        setAssignments((prev) =>
          prev.map((a) => (a.id === data.id ? data : a))
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to respond to assignment.");
      });
  };

  const handleContinueReview = (assignment) => {
    navigate("/review-submission", {
      state: {
        articleId: assignment.articleId,
        articleTitle: assignment.articleTitle,
      },
    });
  };

  if (loading) return <div>Loading assignments…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="in-progress-reviews">
      <h2>In Progress Reviews</h2>

      <section className="new-requests">
        <h3>New Review Requests</h3>
        {newRequests.length === 0 ? (
          <p>No new review requests at this time.</p>
        ) : (
          <div className="requests-list">
            {newRequests.map((r) => (
              <div key={r.id} className="request-card">
                <h4>{r.articleTitle}</h4>
                <p>Assigned: {new Date(r.assignedAt).toLocaleDateString()}</p>
                <div className="request-actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleRespond(r.id, true)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleRespond(r.id, false)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="current-reviews">
        <h3>Current Reviews</h3>
        {inProgress.length === 0 ? (
          <p>No reviews in progress.</p>
        ) : (
          <div className="reviews-list">
            {inProgress.map((r) => (
              <div key={r.id} className="review-card">
                <h4>{r.articleTitle}</h4>
                <p>Assigned: {new Date(r.assignedAt).toLocaleDateString()}</p>

                <div className="review-actions">
                  <button
                    className="continue-btn"
                    onClick={() => handleContinueReview(r)}
                  >
                    Continue Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default InProgressReviews;
