// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", role: "author" });

  // Load users and articles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get("/api/users");
        const articlesRes = await axios.get("/api/articles");
        setUsers(usersRes.data);
        setArticles(articlesRes.data);
      } catch (err) {
        console.error("Error loading data");
      }
    };
    fetchData();
  }, []);

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user");
    }
  };

  // Delete article
  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`/api/articles/${id}`);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (err) {
      console.error("Error deleting article");
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({ email: "", role: "author" });
    } catch (err) {
      console.error("Error adding new user");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            required
          />
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="author">Author</option>
            <option value="reviewer">Reviewer</option>
          </select>
          <button type="submit">Create</button>
        </form>
      </section>

      <section>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email} ({user.role}){" "}
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Articles</h3>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              {article.title} — Author: {article.authorEmail} — Status: {article.status || "unknown"}{" "}
              <button onClick={() => handleDeleteArticle(article.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;