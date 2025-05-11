// src/pages/ReviewerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewerDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("на доработку");
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // Загрузка активных и завершённых рецензий
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const pendingRes = await axios.get("/api/reviews/pending");
        const completedRes = await axios.get("/api/reviews/completed");
        setPendingReviews(pendingRes.data);
        setCompletedReviews(completedRes.data);
      } catch (err) {
        console.error("Ошибка при получении рецензий");
      }
    };
    fetchReviews();
  }, []);

  // Отправка рецензии
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${selectedArticleId}`, {
        comment: reviewText,
        status: reviewStatus,
      });
      alert("Рецензия успешно отправлена!");
      window.location.reload();
    } catch (err) {
      console.error("Ошибка при отправке рецензии");
    }
  };

  return (
    <div>
      <h2>Личный кабинет рецензента</h2>

      <section>
        <h3>Текущие рецензии</h3>
        {pendingReviews.length > 0 ? (
          <ul>
            {pendingReviews.map((review) => (
              <li key={review.articleId}>
                <strong>{review.title}</strong>
                <button onClick={() => setSelectedArticleId(review.articleId)}>
                  Написать рецензию
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет активных заданий.</p>
        )}
      </section>

      {selectedArticleId && (
        <section>
          <h3>Форма составления рецензии</h3>
          <form onSubmit={handleReviewSubmit}>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
            >
              <option value="на доработку">На доработку</option>
              <option value="принято к публикации">Принято к публикации</option>
              <option value="отклонено">Отклонено</option>
            </select>
            <br />
            <textarea
              placeholder="Комментарий рецензента"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <br />
            <button type="submit">Отправить рецензию</button>
          </form>
        </section>
      )}

      <section>
        <h3>История рецензий</h3>
        {completedReviews.length > 0 ? (
          <ul>
            {completedReviews.map((review) => (
              <li key={review.id}>
                <strong>{review.title}</strong> - Статус: {review.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>Вы ещё не написали ни одной рецензии.</p>
        )}
      </section>
    </div>
  );
};

export default ReviewerDashboard;