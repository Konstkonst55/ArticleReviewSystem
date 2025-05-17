import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

function AuthorProfile() {
  const {
    authorInfo,
    bio,
    setBio,
    telegramHandle,
    setTelegramHandle,
    handleSave,
    onLogout,
  } = useOutletContext();

  const [editableData, setEditableData] = useState({
    firstName: authorInfo.firstName || "",
    lastName: authorInfo.lastName || "",
    email: authorInfo.email || "",
    specialization: authorInfo.specialization || "",
    location: authorInfo.location || "",
    phone: authorInfo.phone || "",
    isEditing: false,
  });

  const [tempPhone, setTempPhone] = useState(authorInfo.phone || "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setEditableData((prev) => ({
      ...prev,
      isEditing: !prev.isEditing,
    }));
    if (!editableData.isEditing) {
      setTempPhone(editableData.phone);
    }
  };

  const handleSaveChanges = () => {
    const updatedAuthorInfo = {
      ...authorInfo,
      firstName: editableData.firstName,
      lastName: editableData.lastName,
      email: editableData.email,
      specialization: editableData.specialization,
      location: editableData.location,
      phone: tempPhone,
    };

    setEditableData((prev) => ({ ...prev, phone: tempPhone }));
    handleSave(updatedAuthorInfo);
    toggleEdit();
  };

  const handleCancel = () => {
    setEditableData({
      firstName: authorInfo.firstName,
      lastName: authorInfo.lastName,
      email: authorInfo.email,
      specialization: authorInfo.specialization,
      location: authorInfo.location,
      phone: authorInfo.phone,
      isEditing: false,
    });
    setTempPhone(authorInfo.phone || "");
  };

  return (
    <div className="author-profile">
      <div className="profile-section">
        <div className="section-header">
          <h2>Personal Information</h2>
          {!editableData.isEditing && (
            <button onClick={toggleEdit} className="edit-btn">
              Edit
            </button>
          )}
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Full Name</label>
            {editableData.isEditing ? (
              <div className="name-fields">
                <input
                  type="text"
                  name="firstName"
                  value={editableData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={editableData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <div className="info-value">
                {`${authorInfo.firstName} ${authorInfo.lastName}`.trim() ||
                  "Not specified"}
              </div>
            )}
          </div>

          <div className="info-item">
            <label>Email</label>
            {editableData.isEditing ? (
              <input
                type="email"
                name="email"
                value={editableData.email}
                onChange={handleInputChange}
                // disabled={!editableData.isEditing}
                disabled
              />
            ) : (
              <div className="info-value">
                {authorInfo.email || "Not specified"}
              </div>
            )}
          </div>

          <div className="info-item">
            <label>Specialization</label>
            {editableData.isEditing ? (
              <input
                type="text"
                name="specialization"
                value={editableData.specialization}
                onChange={handleInputChange}
                disabled={!editableData.isEditing}
              />
            ) : (
              <div className="info-value">
                {authorInfo.specialization || "Not specified"}
              </div>
            )}
          </div>

          <div className="info-item">
            <label>Location</label>
            {editableData.isEditing ? (
              <input
                type="text"
                name="location"
                value={editableData.location}
                onChange={handleInputChange}
                disabled={!editableData.isEditing}
              />
            ) : (
              <div className="info-value">
                {authorInfo.location || "Not specified"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2>Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write something about yourself..."
          disabled={!editableData.isEditing}
        />
      </div>

      <div className="profile-section">
        <h2>Social Links</h2>
        <div className="social-links">
          <div className="social-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              width="20"
              height="20"
            >
              <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z" />
            </svg>
            <input
              type="text"
              value={telegramHandle}
              onChange={(e) => setTelegramHandle(e.target.value)}
              placeholder="Telegram handle"
              disabled={!editableData.isEditing}
            />
          </div>
          <div className="social-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="20"
              height="20"
            >
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
            <input
              type="text"
              value={editableData.isEditing ? tempPhone : editableData.phone}
              onChange={(e) => setTempPhone(e.target.value)}
              placeholder="Phone number"
              disabled={!editableData.isEditing}
            />
          </div>
        </div>
      </div>

      <div className="profile-actions">
        {editableData.isEditing && (
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        )}
        <button
          onClick={editableData.isEditing ? handleSaveChanges : onLogout}
          className={editableData.isEditing ? "save-btn" : "logout-btn"}
        >
          {editableData.isEditing ? "Save Changes" : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default AuthorProfile;
