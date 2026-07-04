import { supabase } from "./supabaseClient";

const BASE_URL = "http://localhost:5000/api/reviews";

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function isLoggedIn() {
  const { data } = await supabase.auth.getSession();
  return !!data?.session;
}

export async function fetchReviews() {
  const headers = await getAuthHeaders();
  const res = await fetch(BASE_URL, { headers });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to load reviews");
  return res.json();
}

export async function fetchStats() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}/stats`, { headers });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to load stats");
  return res.json();
}

export async function saveReview({ username, review, rating }) {
  const headers = await getAuthHeaders();
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username, review, rating }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to save review");
  return res.json();
}

export async function analyzePreview(text) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to analyze");
  return res.json();
}
