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

  // Fetching the author's articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/articles/author/me");
        setArticles(response.data);
      } catch (err) {
        setError("Failed to load articles.");
      }
    };
    fetchArticles();
  }, []);

  // Handling form field changes
  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Submitting a new article
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
      setError("Error submitting the article.");
    }
  };

  return (
    <div>
      <h2>Author Dashboard</h2>

      <section>
        <h3>Submit a New Article</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <br />
          <textarea
            name="abstract"
            placeholder="Abstract"
            value={formData.abstract}
            onChange={handleChange}
            required
          />
          <br />
          <input type="file" name="file" onChange={handleChange} required accept=".pdf,.docx" />
          <br />
          <button type="submit">Submit for Review</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>

      <section>
        <h3>My Articles</h3>
        {articles.length > 0 ? (
          <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <strong>{article.title}</strong> - {article.status || "unknown"}
              </li>
            ))}
          </ul>
        ) : (
          <p>You currently have no articles.</p>
        )}
      </section>
    </div>
  );
};

export default AuthorDashboard;