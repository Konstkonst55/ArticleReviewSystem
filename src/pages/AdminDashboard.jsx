import React, { useState } from "react";
import { useFormik } from "formik";

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Editor",
      status: "Active",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Author",
      status: "Active",
      email: "jane@example.com",
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "Reviewer",
      status: "Inactive",
      email: "bob@example.com",
    },
  ]);

  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "React Best Practices",
      author: "John Doe",
      date: "2023-05-15",
      status: "Published",
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      author: "Jane Smith",
      date: "2023-06-20",
      status: "Under Review",
    },
    {
      id: 3,
      title: "JavaScript ES6 Features",
      author: "Bob Johnson",
      date: "2023-07-10",
      status: "Draft",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const adminInfo = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
  };

  const userFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.firstName) {
        errors.firstName = "The field must be filled in";
      }

      if (!values.lastName) {
        errors.lastName = "The field must be filled in";
      }

      if (!values.email) {
        errors.email = "The field must be filled in";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email =
          "The email must contain an @ and a domain (for example, user@example.com )";
      }

      if (!values.role) {
        errors.role = "Role is required";
      }

      return errors;
    },
    onSubmit: (values) => {
      if (editingUserId) {
        setUsers(
          users.map((user) =>
            user.id === editingUserId
              ? {
                  ...user,
                  name: `${values.firstName} ${values.lastName}`,
                  email: values.email,
                  role: values.role,
                }
              : user
          )
        );
        setEditingUserId(null);
      } else {
        const addedUser = {
          id: users.length + 1,
          name: `${values.firstName} ${values.lastName}`,
          role: values.role,
          status: "Active",
          email: values.email,
        };
        setUsers([...users, addedUser]);
      }
      userFormik.resetForm();
      setShowAddUserForm(false);
    },
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const editUser = (user) => {
    const [firstName, lastName] = user.name.split(" ");
    userFormik.setValues({
      firstName,
      lastName,
      email: user.email,
      role: user.role,
    });
    setEditingUserId(user.id);
    setShowAddUserForm(true);
  };

  const changeUserRole = (id, newRole) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const deleteArticle = (id) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <div className="admin-dashboard__user-info">
          <span className="admin-dashboard__username">
            {adminInfo.firstName} {adminInfo.lastName}
          </span>
          <button className="admin-dashboard__logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-dashboard__tabs">
        <button
          className={`admin-dashboard__tab ${
            activeTab === "users" ? "admin-dashboard__tab--active" : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button
          className={`admin-dashboard__tab ${
            activeTab === "articles" ? "admin-dashboard__tab--active" : ""
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="admin-dashboard__search-input"
              />
            </div>

            <button
              className="admin-dashboard__button admin-dashboard__button--add"
              onClick={() => {
                setShowAddUserForm(true);
                setEditingUserId(null);
                userFormik.resetForm();
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
              <div className="admin-dashboard__form-row">
                <div className="admin-dashboard__form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    onChange={userFormik.handleChange}
                    onBlur={userFormik.handleBlur}
                    value={userFormik.values.firstName}
                    className={`admin-dashboard__input ${
                      userFormik.touched.firstName &&
                      userFormik.errors.firstName
                        ? "admin-dashboard__input--error"
                        : ""
                    }`}
                  />
                  {userFormik.touched.firstName &&
                  userFormik.errors.firstName ? (
                    <div className="admin-dashboard__error">
                      {userFormik.errors.firstName}
                    </div>
                  ) : null}
                </div>
                <div className="admin-dashboard__form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={userFormik.handleChange}
                    onBlur={userFormik.handleBlur}
                    value={userFormik.values.lastName}
                    className={`admin-dashboard__input ${
                      userFormik.touched.lastName && userFormik.errors.lastName
                        ? "admin-dashboard__input--error"
                        : ""
                    }`}
                  />
                  {userFormik.touched.lastName && userFormik.errors.lastName ? (
                    <div className="admin-dashboard__error">
                      {userFormik.errors.lastName}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="admin-dashboard__form-row">
                <div className="admin-dashboard__form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={userFormik.handleChange}
                    onBlur={userFormik.handleBlur}
                    value={userFormik.values.email}
                    className={`admin-dashboard__input ${
                      userFormik.touched.email && userFormik.errors.email
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
                    className={`admin-dashboard__select ${
                      userFormik.touched.role && userFormik.errors.role
                        ? "admin-dashboard__input--error"
                        : ""
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="Author">Author</option>
                    <option value="Reviewer">Reviewer</option>
                  </select>
                  {userFormik.touched.role && userFormik.errors.role ? (
                    <div className="admin-dashboard__error">
                      {userFormik.errors.role}
                    </div>
                  ) : null}
                </div>
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
                  disabled={!userFormik.isValid || userFormik.isSubmitting}
                >
                  {editingUserId ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          )}

          <div className="admin-dashboard__table-container">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
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
                            changeUserRole(user.id, e.target.value)
                          }
                          className="admin-dashboard__role-select"
                        >
                          <option value="Author">Author</option>
                          <option value="Reviewer">Reviewer</option>
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
                            className={`admin-dashboard__button admin-dashboard__button--${
                              user.status === "Active" ? "block" : "unblock"
                            }`}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "Active" ? "Block" : "Unblock"}
                          </button>
                          <button
                            className="admin-dashboard__button admin-dashboard__button--edit"
                            onClick={() => editUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-dashboard__button admin-dashboard__button--delete"
                            onClick={() => deleteUser(user.id)}
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
                  <th>Date</th>
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
                            .replace(" ", "-")}`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-dashboard__button admin-dashboard__button--delete"
                          onClick={() => deleteArticle(article.id)}
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
