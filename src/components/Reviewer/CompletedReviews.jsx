import React from "react";

function CompletedReviews() {
  // const completedReviews = [
  //   {
  //     id: 1,
  //     title: "Artificial Intelligence in Education",
  //     authors: "David Wilson, Emma Brown",
  //     completedDate: "Apr 20, 2025",
  //     score: 4,
  //     decision: "Accept with Minor Revisions",
  //   },
  //   {
  //     id: 2,
  //     title: "Blockchain Technologies in Supply Chain",
  //     authors: "Robert Chang, Lisa Martinez",
  //     completedDate: "Mar 15, 2025",
  //     score: 3,
  //     decision: "Major Revisions Required",
  //   },
  //   {
  //     id: 3,
  //     title: "Neural Networks in Image Processing",
  //     authors: "James Anderson, Maria Garcia",
  //     completedDate: "Feb 28, 2025",
  //     score: 5,
  //     decision: "Accept as is",
  //   },
  // ];

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
                    className={`decision ${
                      review.decision.toLowerCase().includes("accept")
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
