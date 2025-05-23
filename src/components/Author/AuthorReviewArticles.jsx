import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function AuthorReviewArticles() {
  const { articles, onSubmitReview } = useOutletContext();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const formatStatus = (status: string) => {
    switch (status) {
      case "UnderReview":
        return "Under Review";
      case "Published":
        return "Published";
      case "Rejected":
        return "Rejected";
      case "Draft":
        return "Draft";
      case "all":
        return "All";
      default:
        return status;
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEditDraft = (draft) => {
    navigate("/author-dashboard/submit-article", {
      state: { draftToEdit: draft },
    });
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const updatedArticles = articles.filter(
        (article) => article.id !== id
      );
      onSubmitReview(updatedArticles);
    }
  };

  const handleCreateNewDraft = () => {
    navigate("/author-dashboard/submit-article");
  };

  return (
    <div className="author-review-articles">
      <h2>Review Articles</h2>

      <div className="filters-container">
        <div className="status-filters">
          {["all", "UnderReview", "Published", "Draft"].map((key) => (
            <button
              key={key}
              className={statusFilter === key ? "active" : ""}
              onClick={() => setStatusFilter(key)}
            >
              {formatStatus(key)} Articles
            </button>
          ))}
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
        <h3>
          {formatStatus(statusFilter)} Articles
          {filteredArticles.length > 0 && (
            <span className="count-badge">
              {filteredArticles.length}
            </span>
          )}
        </h3>

        {filteredArticles.length === 0 ? (
          <div className="no-articles">
            <p>No articles found matching your criteria.</p>
            {statusFilter === "Draft" && (
              <button
                className="create-draft-btn"
                onClick={handleCreateNewDraft}
              >
                Create New Draft
              </button>
            )}
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-header">
                  <h4>{article.title}</h4>
                  <span
                    className={`status-badge ${
                      article.status
                        .toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >
                    {formatStatus(article.status)}
                  </span>
                </div>
                <div className="article-meta">
                  <p className="author">By {article.author}</p>
                  <p className="date">{article.date}</p>
                  <p className="category">{article.category}</p>
                </div>
                <div className="article-actions">
                  <button className="view-btn">View Details</button>
                  {article.status === "Draft" && (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditDraft(article)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteArticle(article.id)
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorReviewArticles;
