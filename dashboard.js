document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isNewUser = urlParams.get('new_user');

  if (isNewUser) {
    const welcomeMessage = document.getElementById('new-user-welcome');
    if (welcomeMessage) {
      welcomeMessage.style.display = 'block';
    }
  }
});