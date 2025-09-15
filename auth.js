// auth.js
// Include this in login.html
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Helper to display errors within the form
  const displayError = (form, message) => {
    const errorDiv = form.querySelector('.auth-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  };

  const hideError = (form) => {
    const errorDiv = form.querySelector('.auth-error');
    if (errorDiv) errorDiv.style.display = 'none';
  };

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideError(registerForm);
      const data = Object.fromEntries(new FormData(registerForm).entries());

      if (data.password !== data.password2) {
        displayError(registerForm, "Passwords do not match.");
        return;
      }

      const res = await apiFetch("/register/", { method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} });
      const result = await handleResponse(res);
      if (result.ok) {
        alert("Registration successful! Please login.");
        document.getElementById('show-login').click(); // Switch to login form
      } else {
        displayError(registerForm, Object.values(result.data).flat().join(' '));
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideError(loginForm);
      let data = Object.fromEntries(new FormData(loginForm).entries());
      // The backend expects 'username', but the minimal form provides 'login'.
      // We'll rename the key before sending.
      data.username = data.login;
      delete data.login;
      const res = await apiFetch("/login/", { method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} });
      const result = await handleResponse(res);
      if (result.ok) {
        saveTokens(result.data);
        alert("Login successful!");
        window.location.href = "claims.html";
      } else {
        displayError(loginForm, "Login failed. Check your credentials.");
      }
    });
  }
});