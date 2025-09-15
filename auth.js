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
        // Show success message inline
        registerForm.innerHTML = `<div class="auth-message success" style="padding: 2rem 0;">✅ Account created successfully! Please log in.</div>`;
        setTimeout(() => {
          document.getElementById('show-login').click();
        }, 2500);
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
        // Show success message and then reload to update the page state
        loginForm.innerHTML = `<div class="auth-message success" style="padding: 2rem 0;">✅ Login successful! Redirecting...</div>`;
        setTimeout(() => {
          document.getElementById('auth-section')?.classList.remove('visible');
          window.location.reload();
        }, 1500);
      } else {
        displayError(loginForm, "Login failed. Check your credentials.");
      }
    });
  }
});