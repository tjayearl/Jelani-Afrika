document.addEventListener('DOMContentLoaded', () => {
  const requestForm = document.getElementById('request-reset-form');
  const resetForm = document.getElementById('reset-password-form');
  const successMessage = document.getElementById('reset-success-message');

  // Check URL for reset token and uid
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const uid = urlParams.get('uid');

  // If token and uid are in the URL, show the reset form. Otherwise, show the request form.
  if (token && uid) {
    requestForm.classList.remove('active');
    resetForm.classList.add('active');
  } else {
    requestForm.classList.add('active');
    resetForm.classList.remove('active');
  }

  // --- Event Listener for Requesting a Reset Link ---
  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = requestForm.querySelector('[name="email"]').value;
    const button = requestForm.querySelector('button[type="submit"]');
    button.disabled = true;

    try {
      const result = await requestPasswordReset(email);
      if (result.ok) {
        // On success, always show the same message to prevent user enumeration
        requestForm.classList.remove('active');
        successMessage.style.display = 'flex';
      }
    } finally {
      button.disabled = false;
    }
  });

  // --- Event Listener for Submitting the New Password ---
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = resetForm.querySelector('[name="new_password"]').value;
    const confirmPassword = resetForm.querySelector('[name="confirm_new_password"]').value;
    const button = resetForm.querySelector('button[type="submit"]');

    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match. Please try again.', 'error');
      return;
    }

    if (!token || !uid) {
      showMessage('Invalid or expired reset link. Please request a new one.', 'error');
      return;
    }

    button.disabled = true;

    try {
      const result = await confirmPasswordReset(token, uid, newPassword);
      if (result.ok) {
        showMessage('Password has been reset successfully! You can now log in.', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }
    } finally {
      button.disabled = false;
    }
  });
});