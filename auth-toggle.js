document.addEventListener('DOMContentLoaded', () => {
  const showLoginBtn = document.getElementById('show-login');
  const showRegisterBtn = document.getElementById('show-register');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
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
      // Autofocus on the first input field
      loginForm.querySelector('input')?.focus();
    });

    showRegisterBtn.addEventListener('click', () => {
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
      twoFaForm.classList.remove('active');
      showLoginBtn.classList.remove('active');
      showRegisterBtn.classList.add('active');
      formToggle.style.display = 'flex';
      // Autofocus on the first input field
      registerForm.querySelector('input')?.focus();
    });
  }

  // --- Password Strength Indicator Logic ---
  const passwordInput = document.getElementById('register-password');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');

  // Autofocus on the first field of the initially active form
  if (loginForm && loginForm.classList.contains('active')) {
    loginForm.querySelector('input')?.focus();
  }

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
});