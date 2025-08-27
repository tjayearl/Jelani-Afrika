document.addEventListener('DOMContentLoaded', () => {
  const requestForm = document.getElementById('request-reset-form');
  const resetForm = document.getElementById('reset-password-form');
  const successMessage = document.getElementById('reset-success-message');

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

  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(requestForm);
      // In a real app, you would send the email to the server here.
      
      // For this demo, we'll just show the success message.
      // In a real scenario, you would only show the success message.
      // The user would then click a link in their email which would lead
      // to a page with the reset-password-form.
      requestForm.classList.remove('active');
      successMessage.style.display = 'flex'; // It's a flex container

      // To demonstrate the flow, we'll also show the reset form after a delay.
      // In a real app, this form would be on a separate page accessed via a token link.
      setTimeout(() => {
        successMessage.style.display = 'none';
        resetForm.classList.add('active');
      }, 4000); // Show reset form after 4 seconds for demo
    });
  }

  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(resetForm);
      const newPassword = resetForm.querySelector('[name="new_password"]').value;
      const confirmPassword = resetForm.querySelector('[name="confirm_new_password"]').value;

      if (newPassword !== confirmPassword) {
        displayError(resetForm, 'Passwords do not match. Please try again.');
        return;
      }

      alert('Your password has been reset successfully! You can now log in.');
      window.location.href = 'login.html';
    });
  }
});