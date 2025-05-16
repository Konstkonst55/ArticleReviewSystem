// import React, { useState } from "react";
// import { useOutletContext } from "react-router-dom";

// function InProgressReviews() {
//   const { reviewerInfo } = useOutletContext();
//   const [newReviewRequests, setNewReviewRequests] = useState([
//     {
//       id: 1,
//       title: "Advanced Neural Networks in Image Processing",
//       authors: "Mark Williams, Lisa Chen",
//       abstract:
//         "This paper presents novel approaches in neural network architectures for advanced image processing tasks...",
//       expectedTime: "4-5 hours",
//       pages: 25,
//     },
//   ]);

//   const [inProgressReviews, setInProgressReviews] = useState([
//     {
//       id: 1,
//       title: "Machine Learning Applications in Healthcare",
//       authors: "Sarah Johnson, Michael Chen",
//       progress: 60,
//       dueDate: "Jun 15, 2025",
//     },
//     {
//       id: 2,
//       title: "Blockchain in Supply Chain Management",
//       authors: "Robert Lee, Anna Wang",
//       progress: 30,
//       dueDate: "Jun 30, 2025",
//     },
//   ]);

//   const handleDecline = (requestId) => {
//     setNewReviewRequests(
//       newReviewRequests.filter((request) => request.id !== requestId)
//     );
//   };

//   return (
//     <div className="in-progress-reviews">
//       <h2>In Progress Reviews</h2>

//       <section className="new-requests">
//         <h3>New Review Requests</h3>
//         {newReviewRequests.length === 0 ? (
//           <p>No new review requests at this time.</p>
//         ) : (
//           <div className="requests-list">
//             {newReviewRequests.map((request) => (
//               <div key={request.id} className="request-card">
//                 <h4>{request.title}</h4>
//                 <p className="authors">Authors: {request.authors}</p>
//                 <p className="abstract">{request.abstract}</p>
//                 <div className="request-meta">
//                   <span>Expected time: {request.expectedTime}</span>
//                   <span>{request.pages} pages</span>
//                 </div>
//                 <div className="request-actions">
//                   <button className="accept-btn">Accept</button>
//                   <button
//                     className="decline-btn"
//                     onClick={() => handleDecline(request.id)}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="current-reviews">
//         <h3>Current Reviews</h3>
//         {inProgressReviews.length === 0 ? (
//           <p>No reviews in progress.</p>
//         ) : (
//           <div className="reviews-list">
//             {inProgressReviews.map((review) => (
//               <div key={review.id} className="review-card">
//                 <h4>{review.title}</h4>
//                 <p className="authors">Authors: {review.authors}</p>

//                 <div className="progress-container">
//                   <div className="progress-bar">
//                     <div
//                       className="progress-fill"
//                       style={{ width: `${review.progress}%` }}
//                     ></div>
//                   </div>
//                   <span className="progress-text">{review.progress}%</span>
//                 </div>

//                 <p className="due-date">Due: {review.dueDate}</p>

//                 <div className="review-actions">
//                   <button className="continue-btn">Continue Review</button>
//                   <button className="request-extension-btn">
//                     Request Extension
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// export default InProgressReviews;

import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

function InProgressReviews() {
  const { reviewerInfo } = useOutletContext();

  // Начальные данные
  const initialNewRequests = [
    {
      id: 1,
      title: "Advanced Neural Networks in Image Processing",
      authors: "Mark Williams, Lisa Chen",
      abstract:
        "This paper presents novel approaches in neural network architectures for advanced image processing tasks...",
      expectedTime: "4-5 hours",
      pages: 25,
    },
  ];

  const initialInProgress = [
    {
      id: 2,
      title: "Machine Learning Applications in Healthcare",
      authors: "Sarah Johnson, Michael Chen",
      progress: 60,
      dueDate: "Jun 15, 2025",
    },
    {
      id: 3,
      title: "Blockchain in Supply Chain Management",
      authors: "Robert Lee, Anna Wang",
      progress: 30,
      dueDate: "Jun 30, 2025",
    },
  ];

  // Состояния
  const [newReviewRequests, setNewReviewRequests] =
    useState(initialNewRequests);
  const [inProgressReviews, setInProgressReviews] = useState(initialInProgress);

  // Обработчик отклонения
  const handleDecline = (requestId) => {
    setNewReviewRequests(
      newReviewRequests.filter((request) => request.id !== requestId)
    );
  };

  // Обработчик принятия
  const handleAccept = (request) => {
    // Удаляем из новых запросов
    setNewReviewRequests(
      newReviewRequests.filter((req) => req.id !== request.id)
    );

    // Добавляем в текущие рецензии
    setInProgressReviews([
      ...inProgressReviews,
      {
        id: request.id,
        title: request.title,
        authors: request.authors,
        progress: 0, // Начинаем с 0% выполнения
        dueDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }), // Устанавливаем срок 2 недели
      },
    ]);
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
                <div className="request-meta">
                  <span>Expected time: {request.expectedTime}</span>
                  <span>{request.pages} pages</span>
                </div>
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
                  <button className="continue-btn">Continue Review</button>
                  <button className="request-extension-btn">
                    Request Extension
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
