// === Base Backend URL ===
const BASE_URL = "https://jelani-backend.onrender.com/api";

// === Helper: Get Token from localStorage ===
function getToken() {
  // This uses the access token, you might need logic to handle refresh tokens
  return localStorage.getItem("accessToken");
}

// === Register ===
async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return { ok: response.ok, data: await response.json() };
}

// === Login (Step 1: Email/Password) ===
async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return { ok: response.ok, data: await response.json() };
}

// === Login (Step 2: Verify 2FA) ===
async function verifyTwoFactor(email, otp) {
    const response = await fetch(`${BASE_URL}/verify-2fa/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        sessionStorage.setItem('isLoggedIn', 'true');
    }
    return { ok: response.ok, data };
}

// === Dashboard Data ===
async function loadDashboardData() {
  const token = getToken();
  if (!token) return { error: "Not logged in" };

  const response = await fetch(`${BASE_URL}/dashboard/`, {
    headers: { Authorization: "Bearer " + token },
  });
  // This will also need to handle token refreshes in a real app
  return response.json();
}

// === Claims ===
async function submitClaim(formData) {
  const token = getToken();
  // When sending FormData, you don't set the Content-Type header.
  // The browser does it automatically with the correct boundary.
  const response = await fetch(`${BASE_URL}/claims/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
  return { ok: response.ok, data: await response.json() };
}

// === Claim Status ===
async function getClaimStatus(claimId) {
  // This endpoint is likely public, but if it requires auth, you'd add the token here.
  const response = await fetch(`${BASE_URL}/claim-status/${claimId}/`);
  return {
    ok: response.ok,
    data: response.ok ? await response.json() : null,
    status: response.status
  };
}

// === Logout ===
function logout() {
  // You might also want to call a backend endpoint to invalidate the refresh token
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("isLoggedIn");
  // Redirect to home or login page
  window.location.href = "index.html";
}