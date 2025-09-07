// === Base Backend URL ===
const BASE_URL = "http://127.0.0.1:8000/api";

// === DOM Helpers ===
function showSpinner() {
  let spinner = document.getElementById("spinner");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.id = "spinner";
    spinner.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="
          width: 60px; height: 60px;
          border: 6px solid #f3f3f3;
          border-top: 6px solid var(--primary-color, #800020);
          border-radius: 50%;
          animation: spin 1s linear infinite;"></div>
      </div>
    `;
    document.body.appendChild(spinner);
  }
}

function hideSpinner() {
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.remove();
}

function showMessage(message, type = "info") {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.position = "fixed";
  div.style.top = "20px";
  div.style.right = "20px";
  div.style.padding = "10px 20px";
  div.style.borderRadius = "5px";
  div.style.zIndex = "10000";
  div.style.color = "#fff";
  div.style.fontWeight = "bold";
  div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  
  if (type === "success") div.style.background = "#28a745";
  else if (type === "error") div.style.background = "#dc3545";
  else div.style.background = "#007bff";

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

// === Helper: Get Token from localStorage ===
function getToken() {
  // This uses the access token, you might need logic to handle refresh tokens
  return localStorage.getItem("accessToken");
}

// === API Wrapper with Error + Loading ===
async function apiCall(url, options = {}, isFormData = false) {
  let headers = options.headers || {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    showSpinner();
    const response = await fetch(url, { ...options, headers });
    // Try to parse JSON, but if it fails (e.g., 204 No Content), return an empty object.
    const data = await response.json().catch(() => ({}));
    hideSpinner();
    
    if (!response.ok) {
      // Construct a meaningful error message from the backend response
      const errorMessage = data.detail || (typeof data === 'object' ? Object.values(data).flat().join(' ') : 'An unknown error occurred.');
      throw new Error(errorMessage || `Request failed with status ${response.status}`);
    }
    return { ok: true, data };
  } catch (error) {
    hideSpinner();
    showMessage(error.message, "error");
    return { ok: false, error: error.message };
  }
}

// === Register ===
function registerUser(userData) {
  return apiCall(`${BASE_URL}/accounts/register/`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// === Login (Step 1: Email/Password) ===
function loginUser(email, password) {
  return apiCall(`${BASE_URL}/accounts/login/`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// === Login (Step 2: Verify 2FA) ===
async function verifyTwoFactor(email, otp) {
  const result = await apiCall(`${BASE_URL}/accounts/verify-2fa/`, {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
  if (result.ok) {
    localStorage.setItem("accessToken", result.data.access);
    localStorage.setItem("refreshToken", result.data.refresh);
    sessionStorage.setItem('isLoggedIn', 'true');
    showMessage("Login successful! 🎉", "success");
  }
  return result;
}

// === Dashboard Data ===
function loadDashboardData() {
  return apiCall(`${BASE_URL}/dashboard/`);
}

// === Claims ===
function submitClaim(formData) {
  return apiCall(`${BASE_URL}/claims/`, {
    method: "POST",
    body: formData,
  }, true); // Pass true to indicate FormData
}

// === Claim Status ===
function getClaimStatus(claimId) {
  return apiCall(`${BASE_URL}/claim-status/${claimId}/`);
}

// === Password Reset (Step 1: Request) ===
function requestPasswordReset(email) {
  return apiCall(`${BASE_URL}/accounts/password-reset/`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// === Password Reset (Step 2: Confirm) ===
function confirmPasswordReset(token, uid, password) {
  return apiCall(`${BASE_URL}/accounts/password-reset/confirm/`, {
    method: 'POST',
    body: JSON.stringify({ token, uid, password }),
  });
}

// === Logout ===
function logout() {
  // You might also want to call a backend endpoint to invalidate the refresh token
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("isLoggedIn");
  showMessage("You have been logged out.", "info");
  setTimeout(() => (window.location.href = "index.html"), 1500);
}

// === CSS for Spinner Animation (inject once) ===
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
`;
document.head.appendChild(style);

// === Protect Pages ===
function protectPage() {
  const token = getToken();
  if (!token) {
    showMessage("Please log in first", "error");
    setTimeout(() => {
      window.location.href = "login.html?reason=unauthenticated";
    }, 1500);
  }
}