import React, { useState } from "react";

function AuthorReviewArticles() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      id: 1,
      title: "Machine Learning Advances in 2025",
      author: "Sarah Johnson",
      date: "May 4, 2025",
      category: "Technology",
      status: "Under Review",
    },
    {
      id: 2,
      title: "Blockchain in Healthcare",
      author: "Michael Chen",
      date: "May 3, 2025",
      category: "Healthcare",
      status: "Under Review",
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      author: "Emma Watson",
      date: "May 2, 2025",
      category: "Environment",
      status: "Published",
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="author-review-articles">
      <h2>Review Articles</h2>

      <div className="status-filters__search-filters">
        <div className="status-filters">
          <button
            className={statusFilter === "all" ? "active" : ""}
            onClick={() => setStatusFilter("all")}
          >
            All Articles
          </button>
          <button
            className={statusFilter === "Under Review" ? "active" : ""}
            onClick={() => setStatusFilter("Under Review")}
          >
            Under Review
          </button>
          <button
            className={statusFilter === "Published" ? "active" : ""}
            onClick={() => setStatusFilter("Published")}
          >
            Published
          </button>
          <button
            className={statusFilter === "Draft" ? "active" : ""}
            onClick={() => setStatusFilter("Draft")}
          >
            Draft
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="articles-list">
        <h2>Articles {statusFilter !== "all" ? `(${statusFilter})` : ""}</h2>

        {filteredArticles.map((article) => (
          <div key={article.id} className="article-item">
            <h3>{article.title}</h3>
            <div className="article-meta">
              <span>by {article.author}</span>
              <span>Submitted: {article.date}</span>
              <span>{article.category}</span>
              <span
                className={`status ${article.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {article.status}
              </span>
            </div>
            <button className="view-details">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthorReviewArticles;
