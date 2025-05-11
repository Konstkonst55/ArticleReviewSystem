// src/pages/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    role: "author",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        setError("Не удалось загрузить список пользователей.");
      }
    };
    fetchUsers();
  }, []);

  // Обработчики формы
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({ email: "", role: "author" });
      setSuccess("Пользователь добавлен успешно.");
      setError("");
    } catch (err) {
      setError("Ошибка при добавлении пользователя.");
      setSuccess("");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого пользователя?")) return;

    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setSuccess("Пользователь удален.");
    } catch (err) {
      setError("Ошибка при удалении пользователя.");
    }
  };

  return (
    <div>
      <h2>Управление пользователями</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <section>
        <h3>Добавить нового пользователя</h3>
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
          <button type="submit">Добавить</button>
        </form>
      </section>

      <section>
        <h3>Список пользователей</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email} — роль: {user.role}
              <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default UserManagement;