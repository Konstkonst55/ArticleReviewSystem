import React from "react";

function CompletedReviews() {
  const [completedReviews, setCompletedReviews] = React.useState(
    JSON.parse(localStorage.getItem("completedReviews")) || []
  );

  const renderStars = (score) => {
    return "★".repeat(score) + "☆".repeat(5 - score);
  };

  return (
    <div className="completed-reviews">
      <h2>Completed Reviews</h2>

      {completedReviews.length === 0 ? (
        <p>No completed reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {completedReviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.title}</h3>
              <p className="authors">Authors: {review.authors}</p>
              <p className="completed-date">
                Completed: {review.completedDate}
              </p>

              <div className="review-meta">
                <div className="review-score">
                  <span>Review Score:</span>
                  <span className="stars">{renderStars(review.score)}</span>
                </div>

                <div className="review-decision">
                  <span>Decision:</span>
                  <span
                    className={`decision ${review.decision.toLowerCase().includes("accept")
                        ? "accept"
                        : "revisions"
                      }`}
                  >
                    {review.decision}
                  </span>
                </div>
              </div>

              <button className="view-review-btn">View Full Review</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompletedReviews;
