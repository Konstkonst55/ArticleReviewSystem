// src/pages/ReviewForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewForm = ({ articleId }) => {
  const [reviewData, setReviewData] = useState({
    comment: "",
    status: "на доработку",
  });

  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Получаем данные о статье (если id передан)
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${articleId}`);
        setArticle(res.data);
      } catch (err) {
        setError("Не удалось загрузить информацию о статье.");
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
      setSuccess("Рецензия успешно отправлена!");
      setError("");
    } catch (err) {
      setError("Ошибка при отправке рецензии.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Создание рецензии</h2>

      {article && <h3>Статья: {article.title}</h3>}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Статус статьи:</label>
          <select name="status" value={reviewData.status} onChange={handleChange}>
            <option value="на доработку">На доработку</option>
            <option value="принято к публикации">Принято к публикации</option>
            <option value="отклонено">Отклонено</option>
          </select>
        </div>

        <div>
          <label>Комментарий:</label>
          <textarea
            name="comment"
            rows="6"
            value={reviewData.comment}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Отправить рецензию</button>
      </form>
    </div>
  );
};

export default ReviewForm;