// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", role: "author" });

  // Загрузка пользователей и статей
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get("/api/users");
        const articlesRes = await axios.get("/api/articles");
        setUsers(usersRes.data);
        setArticles(articlesRes.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных");
      }
    };
    fetchData();
  }, []);

  // Удаление пользователя
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого пользователя?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении пользователя");
    }
  };

  // Удаление статьи
  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту статью?")) return;
    try {
      await axios.delete(`/api/articles/${id}`);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении статьи");
    }
  };

  // Добавление нового пользователя
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({ email: "", role: "author" });
    } catch (err) {
      console.error("Ошибка при добавлении пользователя");
    }
  };

  return (
    <div>
      <h2>Панель администратора</h2>

      <section>
        <h3>Добавить пользователя</h3>
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
            <option value="author">Автор</option>
            <option value="reviewer">Рецензент</option>
          </select>
          <button type="submit">Создать</button>
        </form>
      </section>

      <section>
        <h3>Пользователи</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email} ({user.role}){" "}
              <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Статьи</h3>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              {article.title} — Автор: {article.authorEmail} — Статус: {article.status}{" "}
              <button onClick={() => handleDeleteArticle(article.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;