import React, { useState } from "react";

function AuthorMyArticles() {
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      id: 1,
      title: "Machine Learning Advances in 2025",
      status: "Published",
      date: "May 4, 2025",
      category: "Technology",
    },
    {
      id: 2,
      title: "Blockchain in Healthcare",
      status: "Under Review",
      date: "May 3, 2025",
      category: "Healthcare",
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      status: "Draft",
      date: "May 2, 2025",
      category: "Environment",
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="author-articles">
      <div className="articles-header">
        <h2>My Articles</h2>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="articles-list">
        {filteredArticles.map((article) => (
          <div key={article.id} className="article-item">
            <h3>{article.title}</h3>
            <div className="article-meta">
              <span
                className={`status ${article.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {article.status}
              </span>
              <span>Submitted: {article.date}</span>
              <span>{article.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthorMyArticles;
