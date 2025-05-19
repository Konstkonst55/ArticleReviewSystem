import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  fetchAdminArticles,
  deleteAdminArticle,
  fetchCurrentAdminProfile,
} from "../api";

const mapStringToRole = (roleString) => {
  return roleString;
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentAdmin, setCurrentAdmin] = useState({
    firstName: "Загрузка...",
    lastName: ""
  });

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const response = await fetchCurrentAdminProfile();
        const { fullName, email } = response.data;

        const [firstName, ...rest] = fullName.trim().split(" ");
        const lastName = rest.join(" ") || "";

        setCurrentAdmin({ firstName, lastName, email });
      } catch (err) {
        console.error("Failed to load admin profile:", err);
        setError("Не удалось загрузить профиль администратора.");
        setCurrentAdmin({ firstName: "Ошибка", lastName: "", email: "Ошибка" });
      }
    };

    loadAdminProfile();
  }, []);


  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAdminUsers();

      setUsers(response.data.map(user => ({
        id: user.id,
        name: user.fullName || "N/A",
        role: user.role.toString(),
        status: user.isBlocked ? "Inactive" : "Active",
        email: user.email,

        specialisation: user.specialisation,
        location: user.location,
        bio: user.bio,
        telegramHandle: user.telegramHandle,
        phone: user.phone,
        isBlocked: user.isBlocked,
      })));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load users."
      );
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAdminArticles();

      setArticles(response.data.map(article => ({
        id: article.id,
        title: article.title,
        author: article.author ? article.author.fullName : "Unknown",
        date: new Date(article.createdAt).toLocaleDateString(),
        status: article.status.toString(),

        originalStatus: article.status,
        category: article.category,
      })));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load articles."
      );
      console.error("Failed to load articles:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "articles") {
      loadArticles();
    }
  }, [activeTab, loadUsers, loadArticles]);

  const userFormik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      role: "Author",

      specialisation: "",
      location: "",
      bio: "",
      telegramHandle: "",
      phone: "",

      isBlocked: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.fullName) errors.fullName = "Full Name is required";
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.role) errors.role = "Role is required";

      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setError(null);
      setSubmitting(true);
      try {
        const userData = {
          ...values,
          role: mapStringToRole(values.role),
        };

        if (editingUserId) {
          await updateAdminUser(editingUserId, userData);
        } else {
          await createAdminUser(userData);
        }
        await loadUsers();
        setShowAddUserForm(false);
        setEditingUserId(null);
        resetForm();
      } catch (err) {
        setError(
          err.response?.data?.title ||
          err.response?.data?.message ||
          err.message ||
          `Failed to ${editingUserId ? "update" : "create"} user.`
        );
        console.error(
          `Failed to ${editingUserId ? "update" : "create"} user:`,
          err
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleUserStatus = async (userToToggle) => {
    setError(null);
    try {

      const updatedUserData = {
        id: userToToggle.id,
        fullName: userToToggle.name,
        email: userToToggle.email,
        role: mapStringToRole(userToToggle.role),
        specialisation: userToToggle.specialisation,
        location: userToToggle.location,
        bio: userToToggle.bio,
        telegramHandle: userToToggle.telegramHandle,
        phone: userToToggle.phone,
        isBlocked: !userToToggle.isBlocked,
      };
      await updateAdminUser(userToToggle.id, updatedUserData);
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to toggle user status."
      );
      console.error("Failed to toggle user status:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setError(null);
      try {
        await deleteAdminUser(userId);
        await loadUsers();
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to delete user."
        );
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleEditUser = (userToEdit) => {

    userFormik.setValues({
      fullName: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      specialisation: userToEdit.specialisation || "",
      location: userToEdit.location || "",
      bio: userToEdit.bio || "",
      telegramHandle: userToEdit.telegramHandle || "",
      phone: userToEdit.phone || "",
      isBlocked: userToEdit.isBlocked,

    });
    setEditingUserId(userToEdit.id);
    setShowAddUserForm(true);
  };

  const handleChangeUserRole = async (userId, newRole) => {
    setError(null);
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    try {
      const updatedUserData = {
        ...userToUpdate,
        name: undefined,
        status: undefined,
        fullName: userToUpdate.name,
        role: mapStringToRole(newRole),

      };
      await updateAdminUser(userId, updatedUserData);
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to change user role."
      );
      console.error("Failed to change user role:", err);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setError(null);
      try {
        await deleteAdminArticle(articleId);
        await loadArticles();
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to delete article."
        );
        console.error("Failed to delete article:", err);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.status.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.author.toLowerCase().includes(searchTerm) ||
      article.status.toLowerCase().includes(searchTerm)
  );

  const availableRoles = ["Author", "Reviewer", "Administrator", "User"];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <div className="admin-dashboard__user-info">
          <span className="admin-dashboard__username">
            {currentAdmin.firstName} {currentAdmin.lastName}
          </span>
          <button className="admin-dashboard__logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-dashboard__error-bar" style={{ color: 'red', padding: '10px', border: '1px solid red', margin: '10px 0' }}>
          Error: {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>Close</button>
        </div>
      )}
      {isLoading && <p>Loading...</p>}

      <div className="admin-dashboard__tabs">
        <button
          className={`admin-dashboard__tab ${activeTab === "users" ? "admin-dashboard__tab--active" : ""
            }`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button
          className={`admin-dashboard__tab ${activeTab === "articles" ? "admin-dashboard__tab--active" : ""
            }`}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </button>
      </div>

      {activeTab === "users" ? (
        <section className="admin-dashboard__section">
          <div className="admin-dashboard__controls">
            <div className="admin-dashboard__search">
              <input
                type="text"
                placeholder="Search users by name, email, role, status..."
                value={searchTerm}
                onChange={handleSearch}
                className="admin-dashboard__search-input"
              />
            </div>
            <button
              className="admin-dashboard__button admin-dashboard__button--add"
              onClick={() => {
                setEditingUserId(null);
                userFormik.resetForm({
                  values: {
                    fullName: "",
                    email: "",
                    role: "Author",
                    specialisation: "",
                    location: "",
                    bio: "",
                    telegramHandle: "",
                    phone: "",
                    isBlocked: false,

                  }
                });
                setShowAddUserForm(true);
              }}
            >
              Add New User
            </button>
          </div>

          {showAddUserForm && (
            <form
              onSubmit={userFormik.handleSubmit}
              className="admin-dashboard__form"
            >
              <div className="admin-dashboard__form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.fullName}
                  className={`admin-dashboard__input ${userFormik.touched.fullName && userFormik.errors.fullName
                      ? "admin-dashboard__input--error"
                      : ""
                    }`}
                />
                {userFormik.touched.fullName && userFormik.errors.fullName ? (
                  <div className="admin-dashboard__error">
                    {userFormik.errors.fullName}
                  </div>
                ) : null}
              </div>

              <div className="admin-dashboard__form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.email}
                  className={`admin-dashboard__input ${userFormik.touched.email && userFormik.errors.email
                      ? "admin-dashboard__input--error"
                      : ""
                    }`}
                />
                {userFormik.touched.email && userFormik.errors.email ? (
                  <div className="admin-dashboard__error">
                    {userFormik.errors.email}
                  </div>
                ) : null}
              </div>

              <div className="admin-dashboard__form-group">
                <select
                  name="role"
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                  value={userFormik.values.role}
                  className={`admin-dashboard__select ${userFormik.touched.role && userFormik.errors.role
                      ? "admin-dashboard__input--error"
                      : ""
                    }`}
                >
                  <option value="">Select Role</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {userFormik.touched.role && userFormik.errors.role ? (
                  <div className="admin-dashboard__error">
                    {userFormik.errors.role}
                  </div>
                ) : null}
              </div>

              <input type="text" name="specialisation" placeholder="Specialisation" onChange={userFormik.handleChange} value={userFormik.values.specialisation} className="admin-dashboard__input" />
              <input type="text" name="location" placeholder="Location" onChange={userFormik.handleChange} value={userFormik.values.location} className="admin-dashboard__input" />
              <textarea name="bio" placeholder="Bio" onChange={userFormik.handleChange} value={userFormik.values.bio} className="admin-dashboard__input" />
              <input type="text" name="telegramHandle" placeholder="Telegram Handle" onChange={userFormik.handleChange} value={userFormik.values.telegramHandle} className="admin-dashboard__input" />
              <input type="text" name="phone" placeholder="Phone" onChange={userFormik.handleChange} value={userFormik.values.phone} className="admin-dashboard__input" />

              <div className="admin-dashboard__form-group" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="isBlocked"
                  id="isBlocked"
                  onChange={userFormik.handleChange}
                  checked={userFormik.values.isBlocked}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="isBlocked">Is Blocked</label>
              </div>


              <div className="admin-dashboard__form-actions">
                <button
                  type="button"
                  className="admin-dashboard__button admin-dashboard__button--cancel"
                  onClick={() => {
                    setShowAddUserForm(false);
                    userFormik.resetForm();
                    setEditingUserId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-dashboard__button admin-dashboard__button--submit"
                  disabled={userFormik.isSubmitting || !userFormik.isValid}
                >
                  {userFormik.isSubmitting ? "Submitting..." : (editingUserId ? "Update User" : "Create User")}
                </button>
              </div>
            </form>
          )}

          <div className="admin-dashboard__table-container">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>User (Full Name)</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status (IsBlocked)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleChangeUserRole(user.id, e.target.value)
                          }
                          className="admin-dashboard__role-select"
                          disabled={user.id === editingUserId}
                        >
                          {availableRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span
                          className={`admin-dashboard__status admin-dashboard__status--${user.status.toLowerCase()}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-dashboard__action-buttons">
                          <button
                            className={`admin-dashboard__button admin-dashboard__button--${user.status === "Active" ? "block" : "unblock"
                              }`}
                            onClick={() => toggleUserStatus(user)}
                          >
                            {user.status === "Active" ? "Block" : "Unblock"}
                          </button>
                          <button
                            className="admin-dashboard__button admin-dashboard__button--edit"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-dashboard__button admin-dashboard__button--delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="admin-dashboard__no-results">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="admin-dashboard__section">
          <div className="admin-dashboard__controls">
            <div className="admin-dashboard__search">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className="admin-dashboard__search-input"
              />
            </div>
          </div>

          <div className="admin-dashboard__table-container">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date (Created At)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr key={article.id}>
                      <td>{article.title}</td>
                      <td>{article.author}</td>
                      <td>{article.date}</td>
                      <td>
                        <span
                          className={`admin-dashboard__status admin-dashboard__status--${article.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-dashboard__button admin-dashboard__button--delete"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="admin-dashboard__no-results">
                      No articles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
