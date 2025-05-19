import axios from "axios";

const token = localStorage.getItem("authToken");

const api = axios.create({
  baseURL: "https://localhost:5000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

export function fetchProfile() {
  return api.get("/author-dashboard/profile");
}

export function updateProfile(profileData) {
  return api.put("/author-dashboard/profile", profileData);
}

export function fetchArticles() {
  return api.get("/author-dashboard/articles");
}

export function submitArticle(formData) {
  return api.post("/author-dashboard/submit-article", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function fetchCurrentAdminProfile() {
  return api.get("/me");
}

export const fetchAdminUsers = () => {
  return api.get("/users");
};

export const fetchAdminUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const createAdminUser = (userData) => {
  return api.post("/users", userData);
};

export const updateAdminUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

export const deleteAdminUser = (id) => {
  return api.delete(`/users/${id}`);
};

export const fetchAdminArticles = () => {
  return api.get("/articles");
};

export const fetchAdminArticleById = (id) => {
  return api.get(`/articles/${id}`);
};

export const updateAdminArticle = (id, articleData) => {
  return api.put(`/articles/${id}`, articleData);
};

export const deleteAdminArticle = (id) => {
  return api.delete(`/articles/${id}`);
};

export const getReviewerProfile = () => api.get("/reviewer-dashboard/profile");

export const updateReviewerProfile = (profileData) =>
  api.put("/reviewer-dashboard/profile", profileData);

export const getInProgressAssignments = () =>
  api.get("/reviewer-dashboard/in-progress");

export const getCompletedReviews = () =>
  api.get("/reviewer-dashboard/completed");

export const respondToAssignment = (assignmentId, accept) =>
  api.post(`/assignments/${assignmentId}/respond`, { accept });

export const createReview = (reviewData) => api.post("/reviews", reviewData);

export const getReviewForAssignment = (assignmentId) =>
  api.get(`/reviewer-dashboard/assignments/${assignmentId}/review`);

export const submitOrSaveReview = (reviewData) => {
  if (reviewData.reviewId) {
    return api.put(`/reviews/${reviewData.reviewId}`, reviewData);
  } else {
    const { reviewId, ...dataToSend } = reviewData;
    return api.post("/reviews", dataToSend);
  }
};
