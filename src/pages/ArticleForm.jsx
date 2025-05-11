// src/pages/ArticleForm.jsx
import React, { useState } from "react";
import axios from "axios";

const ArticleForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    file: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("file", formData.file);

    try {
      await axios.post("/api/articles", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Статья успешно отправлена на рецензию!");
      setError("");
      setFormData({ title: "", abstract: "", file: null });
    } catch (err) {
      setError("Ошибка при отправке статьи. Попробуйте снова.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Отправить новую статью</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Заголовок:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Аннотация:</label>
          <textarea
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label>Файл статьи (.pdf или .docx):</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.docx"
            required
          />
        </div>

        <button type="submit">Отправить на рецензию</button>
      </form>
    </div>
  );
};

export default ArticleForm;