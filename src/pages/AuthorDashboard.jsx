// src/pages/AuthorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthorDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    file: null,
  });

  // Получение статей автора
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/articles/author/me");
        setArticles(response.data);
      } catch (err) {
        setError("Не удалось загрузить статьи.");
      }
    };
    fetchArticles();
  }, []);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Отправка новой статьи
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("file", formData.file);

    try {
      const res = await axios.post("/api/articles", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setArticles([res.data, ...articles]);
      setFormData({ title: "", abstract: "", file: null });
    } catch (err) {
      setError("Ошибка при отправке статьи.");
    }
  };

  return (
    <div>
      <h2>Личный кабинет автора</h2>

      <section>
        <h3>Отправить новую статью</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <br />
          <textarea
            name="abstract"
            placeholder="Аннотация"
            value={formData.abstract}
            onChange={handleChange}
            required
          />
          <br />
          <input type="file" name="file" onChange={handleChange} required accept=".pdf,.docx" />
          <br />
          <button type="submit">Отправить на рецензию</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>

      <section>
        <h3>Мои статьи</h3>
        {articles.length > 0 ? (
          <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <strong>{article.title}</strong> - {article.status || "неизвестен"}
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет статей.</p>
        )}
      </section>
    </div>
  );
};

export default AuthorDashboard;