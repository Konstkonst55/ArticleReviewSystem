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

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load user list.");
      }
    };
    fetchUsers();
  }, []);

  // Form handlers
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({ email: "", role: "author" });
      setSuccess("User added successfully.");
      setError("");
    } catch (err) {
      setError("Error adding user.");
      setSuccess("");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setSuccess("User deleted.");
    } catch (err) {
      setError("Error deleting user.");
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

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
          <button type="submit">Add</button>
        </form>
      </section>

      <section>
        <h3>User List</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email} — Role: {user.role}
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default UserManagement;