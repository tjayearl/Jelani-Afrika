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
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(loginForm);
      const password = loginForm.querySelector('[name="password"]').value;

      // Demo logic: any password other than "password123" is wrong
      if (password !== 'password123') {
        displayError(loginForm, 'Invalid password. Please try again.');
      } else {
        // On successful password, show 2FA form
        loginForm.classList.remove('active');
        twoFaForm.classList.add('active');
        formToggle.style.display = 'none'; // Hide tabs during 2FA
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(registerForm);
      const password = registerForm.querySelector('[name="password"]').value;
      const confirmPassword = registerForm.querySelector('[name="confirm_password"]').value;

      if (password !== confirmPassword) {
        displayError(registerForm, 'Passwords do not match. Please try again.');
        return;
      }
      
      // On successful registration, redirect to dashboard with a welcome message
      window.location.href = 'dashboard.html?new_user=true';
    });
  }

  if (twoFaForm) {
    twoFaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(twoFaForm);
      const code = twoFaForm.querySelector('[name="2fa_code"]').value;

      // Demo logic: any code other than "123456" is wrong
      if (code !== '123456') {
        displayError(twoFaForm, 'Incorrect code. Please try again.');
      } else {
        alert('Login successful!');
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
      }
    });
  }
});