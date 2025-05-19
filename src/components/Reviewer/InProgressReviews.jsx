import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function InProgressReviews() {
  const { reviewerInfo } = useOutletContext();
  const navigate = useNavigate();

  const isAvailableForReviews = reviewerInfo.availableForReviews !== false;

  const initialNewRequests = isAvailableForReviews
    ? [
        {
          id: 1,
          title: "Advanced Neural Networks in Image Processing",
          authors: "Mark Williams, Lisa Chen",
          abstract: "This paper presents novel approaches...",
          expectedTime: "4-5 hours",
          pages: 25,
        },
      ]
    : [];

  const [inProgressReviews, setInProgressReviews] = React.useState(
    JSON.parse(localStorage.getItem("inProgressReviews")) ||
      [].filter((review) => review.reviewerId === reviewerInfo.id)
  );

  const [newReviewRequests, setNewReviewRequests] =
    useState(initialNewRequests);

  const handleDecline = (requestId) => {
    setNewReviewRequests(
      newReviewRequests.filter((request) => request.id !== requestId)
    );
  };

  const handleAccept = (request) => {
    setNewReviewRequests(
      newReviewRequests.filter((req) => req.id !== request.id)
    );

    setInProgressReviews([
      ...inProgressReviews,
      {
        id: request.id,
        title: request.title,
        authors: request.authors,
        progress: 0,
        dueDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      },
    ]);
  };

  const handleContinueReview = (review) => {
    navigate("/review-submission", {
      state: {
        articleData: {
          title: review.title,
          authors: review.authors,
        },
      },
    });
  };

  return (
    <div className="in-progress-reviews">
      <h2>In Progress Reviews</h2>

      <section className="new-requests">
        <h3>New Review Requests</h3>
        {newReviewRequests.length === 0 ? (
          <p>No new review requests at this time.</p>
        ) : (
          <div className="requests-list">
            {newReviewRequests.map((request) => (
              <div key={request.id} className="request-card">
                <h4>{request.title}</h4>
                <p className="authors">Authors: {request.authors}</p>
                <p className="abstract">{request.abstract}</p>
                <div className="request-actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(request)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleDecline(request.id)}
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
        {inProgressReviews.length === 0 ? (
          <p>No reviews in progress.</p>
        ) : (
          <div className="reviews-list">
            {inProgressReviews.map((review) => (
              <div key={review.id} className="review-card">
                <h4>{review.title}</h4>
                <p className="authors">Authors: {review.authors}</p>

                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${review.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{review.progress}%</span>
                </div>

                <p className="due-date">Due: {review.dueDate}</p>

                <div className="review-actions">
                  <button
                    className="continue-btn"
                    onClick={() => handleContinueReview(review)}
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
