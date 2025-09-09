document.addEventListener('DOMContentLoaded', () => {
  const showLoginBtn = document.getElementById('show-login');
  const showRegisterBtn = document.getElementById('show-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const twoFaForm = document.getElementById('2fa-form');
  const formWrapper = document.querySelector('.form-wrapper');
  const formToggle = document.querySelector('.form-toggle');

  // --- Form Toggling Logic ---
  if (showLoginBtn && showRegisterBtn && loginForm && registerForm) {
    showLoginBtn.addEventListener('click', () => {
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      twoFaForm.classList.remove('active');
      showLoginBtn.classList.add('active');
      showRegisterBtn.classList.remove('active');
      formToggle.style.display = 'flex';
    });

    showRegisterBtn.addEventListener('click', () => {
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
      twoFaForm.classList.remove('active');
      showLoginBtn.classList.remove('active');
      showRegisterBtn.classList.add('active');
      formToggle.style.display = 'flex';
    });
  }

  // --- Password Strength Indicator Logic ---
  const passwordInput = document.getElementById('register-password');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');

  if (passwordInput && strengthBar && strengthText) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strength = checkPasswordStrength(password);
      
      // Remove all previous strength classes
      strengthBar.classList.remove('weak', 'medium', 'strong');

      if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
      }

      switch (strength) {
        case 0:
        case 1:
          strengthBar.style.width = '33%';
          strengthBar.style.backgroundColor = '#dc3545'; // Red
          strengthText.textContent = 'Weak';
          strengthText.style.color = '#dc3545';
          break;
        case 2:
        case 3:
          strengthBar.style.width = '66%';
          strengthBar.style.backgroundColor = '#ffc107'; // Yellow
          strengthText.textContent = 'Medium';
          strengthText.style.color = '#ffc107';
          break;
        case 4:
          strengthBar.style.width = '100%';
          strengthBar.style.backgroundColor = '#28a745'; // Green
          strengthText.textContent = 'Strong';
          strengthText.style.color = '#28a745';
          break;
      }
    });
  }

  function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++; // Check for special characters
    return score;
  }

  // A new general-purpose message display function, since the old one was removed.
  function showMessage(message, type = "info") {
    const div = document.createElement("div");
    div.textContent = message;
    div.className = `auth-message ${type}`; // Use classes for styling
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3500);
  }

  // Helper to get a single error message from the backend response
  const getErrorMessage = (data) => typeof data === 'object' ? Object.values(data).flat().join(' ') : data;

  // --- Form Submission & Error Handling ---
  const displayError = (form, message) => {
    const errorDiv = form.querySelector('.auth-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  };

  const hideError = (form) => {
    const errorDiv = form.querySelector('.auth-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(loginForm);
      const email = loginForm.querySelector('[name="email"]').value;
      const password = loginForm.querySelector('[name="password"]').value;      
      const button = loginForm.querySelector('button[type="submit"]');
      const errorEl = loginForm.querySelector('.auth-error');

      try {
        // The new loginUser expects an object with `username` and `password`.
        // We'll use the email as the username.
        const result = await loginUser({ username: email, password }, button);
        if (result.ok) {
          // The new script doesn't handle 2FA, so we redirect to dashboard on success.
          showMessage('Login successful! Redirecting...', 'success');
          sessionStorage.setItem('isLoggedIn', 'true'); // Keep this for UI updates
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        } else {
          const errorMessage = getErrorMessage(result.data);
          displayError(loginForm, errorMessage || `Login failed with status ${result.status}.`);
        }
      } catch (error) {
        displayError(loginForm, "An unexpected error occurred. Please try again.");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(registerForm);
      const name = registerForm.querySelector('[name="username"]').value;
      const email = registerForm.querySelector('[name="email"]').value;
      const phone = registerForm.querySelector('[name="phone"]').value;
      const password = registerForm.querySelector('[name="password"]').value;
      const confirmPassword = registerForm.querySelector('[name="password2"]').value;

      if (password !== confirmPassword) {
        displayError(registerForm, 'Passwords do not match.');
        return;
      }

      const button = registerForm.querySelector('button[type="submit"]');
      
      try {
        // The new registerUser expects specific fields.
        const result = await registerUser({ username: name, email, password, password2: confirmPassword, phone }, button);
        if (result.ok) {
          showMessage('Registration successful! Please log in.', 'success');
          // Switch to the login form
          showLoginBtn.click();
        } else {
          const errorMessage = getErrorMessage(result.data);
          displayError(registerForm, errorMessage || `Registration failed with status ${result.status}.`);
        }
      } catch (error) {
        displayError(registerForm, "An unexpected error occurred. Please try again.");
      }
    });
  }

  if (twoFaForm) {
    twoFaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError(twoFaForm);
      // The new script.js doesn't have a 2FA function.
      // We can add a message here or simply remove the logic for now.
      showMessage("2FA is not currently configured.", "info");
    });
  }
});