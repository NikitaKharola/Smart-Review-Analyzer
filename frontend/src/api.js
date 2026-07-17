const BASE_URL = "http://localhost:5000/api/reviews";
const AUTH_URL = "http://localhost:5000/api/auth";
const ACCOUNT_URL = "http://localhost:5000/api/account";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const res = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    localStorage.removeItem("token"); // stale/expired token — clear it
    return false;
  }
  return true;
}

// Fetches the logged-in user's own profile info (id, email, fullName).
// Returns null if not logged in / token invalid, instead of throwing —
// callers that need to redirect to /login should check isLoggedIn() first.
export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchReviews() {
  const headers = getAuthHeaders();
  const res = await fetch(BASE_URL, { headers });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to load reviews");
  return res.json();
}

export async function fetchStats() {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/stats`, { headers });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to load stats");
  return res.json();
}

export async function saveReview({ username, review, rating }) {
  const headers = getAuthHeaders();
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username, review, rating }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to save review");
  return res.json();
}

export async function saveBulkReviews({ username, reviews }) {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify({ username, reviews }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to process reviews");
  return res.json();
}

export async function analyzePreview(text) {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to analyze");
  return res.json();
}

export async function downloadReport() {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/report`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to generate report");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "guest-review-report.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

// Update a review
export async function updateReview(id, { username, review, rating }) {
  const headers = getAuthHeaders();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      username,
      review,
      rating,
    }),
  });

  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to update review");
  }

  return res.json();
}

// Delete a review
export async function deleteReview(id) {
  const headers = getAuthHeaders();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to delete review");
  }

  return res.json();
}

// --- Account settings ---
// These all use our own JWT (via getAuthHeaders), same as everything above.

export async function updateProfile({ fullName }) {
  const headers = getAuthHeaders();
  const res = await fetch(`${ACCOUNT_URL}/profile`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ fullName }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Could not update profile.");
  return res.json();
}

export async function updatePassword({ newPassword }) {
  const headers = getAuthHeaders();
  const res = await fetch(`${ACCOUNT_URL}/password`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Could not update password.");
  return res.json();
}

export async function deleteAccount() {
  const headers = getAuthHeaders();
  const res = await fetch(ACCOUNT_URL, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error((await res.json()).message || "Could not delete account.");
  return res.json();
}