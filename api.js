// api.js
const API_URL = "http://127.0.0.1:8000/api"; // Base backend URL with /api prefix

function saveTokens(tokens) {
  // Use 'access_token' and 'refresh_token' for consistency with the rest of the app
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
}

function getToken() {
  return localStorage.getItem("access_token");
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    // Content-Type is not always 'application/json', e.g., for FormData.
    // Let the caller or the browser specify it.
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  if (res.status === 401) {
    alert("Session expired. Please login again.");
    logout(); // Use the logout function from script.js for a clean exit
    throw new Error("Unauthorized"); // Stop further execution
  }

  return res;
}