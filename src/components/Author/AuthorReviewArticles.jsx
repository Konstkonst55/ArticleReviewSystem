import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function AuthorReviewArticles() {
  const { authorInfo, onSubmitReview } = useOutletContext();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [articles, setArticles] = useState([
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
    {
      id: 4,
      title: "Draft Article Example",
      author: `${authorInfo.firstName} ${authorInfo.lastName}`,
      date: "May 1, 2025",
      category: "Business",
      status: "Draft",
    },
  ]);

  const filteredArticles = articles.filter((article) => {
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.author &&
        article.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleEditDraft = (draft) => {
    navigate("/author-dashboard/submit-article", {
      state: { draftToEdit: draft },
    });
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };

  return (
    <div className="author-review-articles">
      <h2>Review Articles</h2>

      <div className="filters-container">
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
            Drafts
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
        <h3>
          {statusFilter === "all" ? "All Articles" : `${statusFilter} Articles`}
          {filteredArticles.length > 0 && (
            <span className="count-badge">{filteredArticles.length}</span>
          )}
        </h3>

        {filteredArticles.length === 0 ? (
          <div className="no-articles">
            <p>No articles found matching your criteria.</p>
            {statusFilter === "Draft" && (
              <button
                className="create-draft-btn"
                onClick={() => navigate("/author-dashboard/submit-article")}
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
                    className={`status-badge ${article.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {article.status}
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
                        onClick={() => handleDeleteArticle(article.id)}
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
