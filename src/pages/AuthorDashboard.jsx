import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import { fetchProfile, fetchArticles, updateProfile } from '../api';

function AuthorDashboard({ onLogout }) {
  const [authorInfo, setAuthorInfo] = useState(null);
  const [articles, setArticles] = useState([]);
  const [bio, setBio] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.split('/').pop() || 'profile'
  );

  useEffect(() => {
    fetchProfile()
      .then(res => {
        const data = res.data;
        setAuthorInfo({
          firstName: data.fullName.split(' ')[0],
          lastName: data.fullName.split(' ')[1] || '',
          email: data.email,
          specialization: data.specialisation,
          location: data.location,
          bio: data.bio,
          telegramHandle: data.telegramHandle,
          phone: data.phone,
        });
        setBio(data.bio);
        setTelegramHandle(data.telegramHandle);
      })
      .catch(err => console.error(err));

    fetchArticles()
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!authorInfo) return <p>Loading profile...</p>;

  const handleSave = async (updatedInfo) => {
    try {
      const payload = {
        fullName: `${updatedInfo.firstName} ${updatedInfo.lastName}`.trim(),
        specialisation: updatedInfo.specialization,
        location: updatedInfo.location,
        phone: updatedInfo.phone,
        bio,
        telegramHandle
      };
      await updateProfile(payload);
      setAuthorInfo(updatedInfo);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="author-dashboard">
      <div className="author-header">
        <h1>
          {authorInfo.firstName} {authorInfo.lastName}
        </h1>
        <p>{authorInfo.specialization}</p>
      </div>

      <nav className="author-nav">
        <Link
          to="profile"
          className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </Link>
        <Link
          to="submit-article"
          className={`nav-link ${activeTab === "submit-article" ? "active" : ""
            }`}
          onClick={() => setActiveTab("submit-article")}
        >
          Submit Article
        </Link>
        <Link
          to="review-articles"
          className={`nav-link ${activeTab === "review-articles" ? "active" : ""
            }`}
          onClick={() => setActiveTab("review-articles")}
        >
          Review Articles
        </Link>
      </nav>

      <div className="author-content">
        <Outlet context={{ authorInfo, bio, setBio, telegramHandle, setTelegramHandle, handleSave, onLogout, articles, setArticles }} />
      </div>
    </div>
  );
}

export default AuthorDashboard;
